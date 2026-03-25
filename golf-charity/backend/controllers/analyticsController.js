const supabase = require('../supabase');

const getAnalytics = async (req, res) => {
  try {
    // 1. Total Users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 2. Total Subscribed Users
    const { count: activeSubscribers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'active');

    // 3. Total Prize Pool (from completed draws)
    const { data: draws } = await supabase
      .from('draws')
      .select('prize_pool, id')
      .eq('status', 'completed');
    
    const totalPrizePool = draws ? draws.reduce((sum, d) => sum + parseFloat(d.prize_pool || 0), 0) : 0;

    // 4. Charity Contribution Totals
    // For this simulation, assuming each active subscriber pays 10/month and gives charity_percentage% to their charity
    const { data: activeUsers } = await supabase
      .from('users')
      .select('charity_percentage')
      .eq('subscription_status', 'active');
    
    let totalCharityRaised = 0;
    if (activeUsers) {
      activeUsers.forEach(u => {
        const perc = u.charity_percentage || 10;
        totalCharityRaised += (10 * (perc / 100)); // $10 plan * percentage
      });
    }

    res.json({
      totalUsers: totalUsers || 0,
      activeSubscribers: activeSubscribers || 0,
      totalPrizePool: totalPrizePool.toFixed(2),
      totalCharityRaised: totalCharityRaised.toFixed(2),
      totalDraws: draws ? draws.length : 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { getAnalytics };
