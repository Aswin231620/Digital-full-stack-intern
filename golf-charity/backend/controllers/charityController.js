const supabase = require('../supabase');

const getCharities = async (req, res) => {
  try {
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*');

    if (error) throw error;
    res.json({ charities });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const addCharity = async (req, res) => {
  try {
    const { name, description, logo_url } = req.body;

    const { data: charity, error } = await supabase
      .from('charities')
      .insert([{ name, description, logo_url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Charity added', charity });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const selectCharity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { charityId } = req.body;

    const { error } = await supabase
      .from('users')
      .update({ charity_id: charityId })
      .eq('id', userId);

    if (error) throw error;

    res.json({ message: 'Charity selected successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo_url } = req.body;

    const { data: charity, error } = await supabase
      .from('charities')
      .update({ name, description, logo_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Charity updated', charity });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Charity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { getCharities, addCharity, selectCharity, updateCharity, deleteCharity };
