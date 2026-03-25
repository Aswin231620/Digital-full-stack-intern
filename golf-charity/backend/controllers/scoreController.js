const supabase = require('../supabase');

const addScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, score_date } = req.body;

    if (score < 1 || score > 45) {
      return res.status(400).json({ error: 'Score must be between 1 and 45' });
    }

    // Insert new score
    const { error: insertError } = await supabase
      .from('scores')
      .insert([{ user_id: userId, score, score_date: score_date || new Date().toISOString() }]);

    if (insertError) throw insertError;

    // Fetch all user scores ordered by date descending
    const { data: scores, error: fetchError } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    // If more than 5, delete the older ones
    if (scores.length > 5) {
      const idsToDelete = scores.slice(5).map(s => s.id);
      const { error: deleteError } = await supabase
        .from('scores')
        .delete()
        .in('id', idsToDelete);
        
      if (deleteError) throw deleteError;
    }

    res.status(201).json({ message: 'Score added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getScores = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ scores });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, score_date } = req.body;
    const userId = req.user.id;

    if (score < 1 || score > 45) {
      return res.status(400).json({ error: 'Score must be between 1 and 45' });
    }

    // Ensure score belongs to user OR admin
    const { data: existingScore, error: fetchErr } = await supabase
      .from('scores')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existingScore) return res.status(404).json({ error: 'Score not found' });
    if (existingScore.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No permission to edit this score' });
    }

    const { error: updateError } = await supabase
      .from('scores')
      .update({ score, score_date })
      .eq('id', id);

    if (updateError) throw updateError;

    res.json({ message: 'Score updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: existingScore, error: fetchErr } = await supabase
      .from('scores')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !existingScore) return res.status(404).json({ error: 'Score not found' });
    if (existingScore.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No permission to delete this score' });
    }

    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({ message: 'Score deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { addScore, getScores, updateScore, deleteScore };
