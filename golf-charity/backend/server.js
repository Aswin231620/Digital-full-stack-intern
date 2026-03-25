const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');
const subscriptionRoutes = require('./routes/subscriptions');
const drawRoutes = require('./routes/draws');
const charityRoutes = require('./routes/charities');
const winnerRoutes = require('./routes/winners');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api', drawRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api', winnerRoutes);
app.use('/api', userRoutes);
app.use('/api/admin', analyticsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Golf Charity Platform API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
