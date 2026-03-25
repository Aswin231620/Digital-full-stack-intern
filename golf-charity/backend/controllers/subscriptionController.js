const supabase = require('../supabase');

const subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body; // 'monthly' or 'yearly'

    if (!['monthly', 'yearly'].includes(type)) {
      return res.status(400).json({ error: 'Invalid subscription type' });
    }

    const now = new Date();
    const end = new Date(now);
    if (type === 'monthly') {
      end.setDate(end.getDate() + 30);
    } else {
      end.setFullYear(end.getFullYear() + 1);
    }

    const { data: user, error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_type: type,
        subscription_start: now.toISOString(),
        subscription_end: end.toISOString()
      })
      .eq('id', userId)
      .select('subscription_status, subscription_type, subscription_start, subscription_end')
      .single();

    if (error) throw error;

    res.json({ message: 'Subscription activated successfully', subscription: user });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_status, subscription_type, subscription_start, subscription_end')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Auto-expire subscription if end_date passed
    if (user.subscription_status === 'active' && user.subscription_end) {
      const now = new Date();
      const end = new Date(user.subscription_end);
      if (now > end) {
        await supabase
          .from('users')
          .update({ subscription_status: 'inactive' })
          .eq('id', userId);
        user.subscription_status = 'inactive';
      }
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { error } = await supabase
      .from('users')
      .update({ subscription_status: 'inactive' })
      .eq('id', userId);

    if (error) throw error;
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { subscribe, getStatus, cancelSubscription };
