const supabase = require('../supabase');

const uploadProof = async (req, res) => {
  try {
    const userId = req.user.id;
    const { winnerId, proofImageUrl } = req.body;

    const { data: winner, error: fetchError } = await supabase
      .from('winners')
      .select('*')
      .eq('id', winnerId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !winner) return res.status(404).json({ error: 'Winning record not found' });

    const { error: updateError } = await supabase
      .from('winners')
      .update({ proof_image_url: proofImageUrl })
      .eq('id', winnerId);

    if (updateError) throw updateError;

    res.json({ message: 'Proof uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const verifyWinner = async (req, res) => {
  try {
    const { winnerId, status } = req.body; // 'paid' or 'rejected'

    if (!['paid', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { error } = await supabase
      .from('winners')
      .update({ status })
      .eq('id', winnerId);

    if (error) throw error;

    res.json({ message: `Winner status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getWinners = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: winners, error } = await supabase
      .from('winners')
      .select('*, draws(draw_date, winning_numbers)')
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ winners });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getAllWinnersAdmin = async (req, res) => {
  try {
    const { data: winners, error } = await supabase
      .from('winners')
      .select('*, users(email), draws(draw_date)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ winners });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { uploadProof, verifyWinner, getWinners, getAllWinnersAdmin };
