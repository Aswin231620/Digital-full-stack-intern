const supabase = require('../supabase');

const generateRandomNumbers = (count, max) => {
  const nums = new Set();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(nums);
};

const generateAlgorithmNumbers = async (count, max) => {
  const { data: scores } = await supabase.from('scores').select('score');
  if (!scores || scores.length === 0) return generateRandomNumbers(count, max);

  const freq = {};
  scores.forEach(s => {
    freq[s.score] = (freq[s.score] || 0) + 1;
  });

  const sortedNums = Object.keys(freq).map(Number).sort((a, b) => freq[b] - freq[a]);
  const nums = new Set();
  
  for (let i = 0; i < sortedNums.length && nums.size < count; i++) {
    if (Math.random() > 0.2) {
      nums.add(sortedNums[i]);
    }
  }

  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * max) + 1);
  }

  return Array.from(nums).slice(0, count);
};

// Get next draw date (last day of next month)
const getNextDrawDate = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 2, 0); // last day of next month
  return next.toISOString();
};

const runDraw = async (req, res) => {
  try {
    const { type = 'random', simulate = false } = req.body;
    let winningNumbers;
    
    if (type === 'algorithm') {
      winningNumbers = await generateAlgorithmNumbers(5, 45);
    } else {
      winningNumbers = generateRandomNumbers(5, 45);
    }

    // Count active subscribers
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    const totalPrizePool = (count || 0) * 10;
    // Check if there's any rollover from previous draws with no jackpot winner
    const { data: prevDraws } = await supabase
      .from('draws')
      .select('prize_pool, id')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1);

    let rolledOver = 0;
    if (prevDraws && prevDraws.length > 0) {
      // Check if the last draw had any 5-match winner
      const { count: jackpotCount } = await supabase
        .from('winners')
        .select('*', { count: 'exact', head: true })
        .eq('draw_id', prevDraws[0].id)
        .eq('match_count', 5);
      
      if (jackpotCount === 0) {
        // Roll over 40% of last pool (the unclaimed jackpot portion)
        rolledOver = parseFloat(prevDraws[0].prize_pool) * 0.40;
      }
    }

    const basePrizePool = Math.max(totalPrizePool, 1000);
    const finalPrizePool = basePrizePool + rolledOver;

    let drawId = 'simulation-id';
    let draw = { id: drawId, winning_numbers: winningNumbers, prize_pool: finalPrizePool, status: 'simulated' };

    if (!simulate) {
      // Create draw record
      const { data: insertedDraw, error: drawError } = await supabase
        .from('draws')
        .insert([{ winning_numbers: winningNumbers, prize_pool: finalPrizePool }])
        .select()
        .single();
  
      if (drawError) throw drawError;
      draw = insertedDraw;
      drawId = draw.id;
    }

    // Fetch active users with their latest scores
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, scores(score)')
      .eq('subscription_status', 'active');

    if (usersError) throw usersError;

    const winnerCategories = { 5: [], 4: [], 3: [] };
    const winningSet = new Set(winningNumbers);

    users.forEach(user => {
      const userScores = user.scores.map(s => s.score);
      let matchCount = 0;
      userScores.forEach(score => { if (winningSet.has(score)) matchCount++; });
      if (matchCount >= 3 && matchCount <= 5) {
        winnerCategories[matchCount].push(user.id);
      }
    });

    const pool5 = finalPrizePool * 0.40;
    const pool4 = finalPrizePool * 0.35;
    const pool3 = finalPrizePool * 0.25;

    const payout = (arr, pool) => arr.length > 0 ? parseFloat((pool / arr.length).toFixed(2)) : 0;
    const payout5 = payout(winnerCategories[5], pool5);
    const payout4 = payout(winnerCategories[4], pool4);
    const payout3 = payout(winnerCategories[3], pool3);

    const winnersToInsert = [];
    const addWinners = (arr, matchCount, amount) => {
      if (amount <= 0) return;
      arr.forEach(userId => winnersToInsert.push({ draw_id: drawId, user_id: userId, match_count: matchCount, prize_amount: amount }));
    };
    addWinners(winnerCategories[5], 5, payout5);
    addWinners(winnerCategories[4], 4, payout4);
    addWinners(winnerCategories[3], 3, payout3);

    if (!simulate && winnersToInsert.length > 0) {
      const { error: winnerError } = await supabase.from('winners').insert(winnersToInsert);
      if (winnerError) throw winnerError;
    }

    const jackpotRolledOver = winnerCategories[5].length === 0;

    res.json({
      message: simulate 
        ? 'Simulation complete!' 
        : jackpotRolledOver
          ? 'Draw complete! No jackpot winner. 40% rolls over to next draw.'
          : 'Draw complete! Jackpot won!',
      rolledOver: simulate ? false : jackpotRolledOver,
      rolledOverAmount: jackpotRolledOver ? pool5 : 0,
      draw,
      breakdown: {
        matches5: { count: winnerCategories[5].length, payout: payout5 },
        matches4: { count: winnerCategories[4].length, payout: payout4 },
        matches3: { count: winnerCategories[3].length, payout: payout3 },
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getDraws = async (req, res) => {
  try {
    const { data: draws, error } = await supabase
      .from('draws')
      .select('*')
      .order('draw_date', { ascending: false });

    if (error) throw error;
    res.json({ draws, nextDrawDate: getNextDrawDate() });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { runDraw, getDraws };
