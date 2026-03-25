const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

const register = async (req, res) => {
  try {
    const { email, password, role = 'user', charity_id } = req.body;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Insert user into Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email, password_hash, role, charity_id }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
      throw error;
    }

    // Generate Token
    const tokenPayload = { id: user.id, email: user.email, role: user.role, subscription_status: user.subscription_status };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'golf_charity_super_secret_key_123', { expiresIn: '24h' });

    res.status(201).json({ message: 'User registered successfully', token, user: tokenPayload });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role, subscription_status: user.subscription_status };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'golf_charity_super_secret_key_123', { expiresIn: '24h' });

    res.json({ message: 'Login successful', token, user: tokenPayload });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

module.exports = { register, login };
