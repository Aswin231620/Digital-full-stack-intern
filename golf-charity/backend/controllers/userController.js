const supabase = require('../supabase');

const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, role, subscription_status, subscription_type, subscription_start, subscription_end, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, charity_id, charity_percentage, subscription_status, subscription_type, subscription_start, subscription_end, created_at')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const updateCharity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { charity_id, charity_percentage } = req.body;
    
    const updates = {};
    if (charity_id) updates.charity_id = charity_id;
    if (charity_percentage !== undefined) {
      if (charity_percentage < 10) return res.status(400).json({ error: 'Minimum donation is 10%' });
      updates.charity_percentage = charity_percentage;
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, subscription_status } = req.body;

    const { error } = await supabase
      .from('users')
      .update({ role, subscription_status })
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { getAllUsers, getUserProfile, updateCharity, adminUpdateUser, adminDeleteUser };
