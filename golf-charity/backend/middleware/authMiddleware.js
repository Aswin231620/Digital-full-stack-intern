const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET || 'golf_charity_super_secret_key_123', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.user = decoded; // Contains id, email, role, subscription_status
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Require Admin Role' });
    }
    next();
  });
};

const verifySubscribed = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'admin') return next(); // Admins bypass subscription check
    if (req.user.subscription_status !== 'active') {
      return res.status(403).json({ error: 'Require Active Subscription to access features' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin, verifySubscribed };
