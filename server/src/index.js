const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const dns = require('node:dns');

// Load environment variables
dotenv.config();

// Fix network timeout issues by preferring IPv4
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return allowedOrigin === origin || origin.endsWith('.vercel.app');
    });

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/donors', require('./routes/donor.routes'));
app.use('/api/donations', require('./routes/donation.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));
app.use('/api/volunteers', require('./routes/volunteer.routes'));
app.use('/api/programs', require('./routes/program.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/heroes', require('./routes/hero.routes'));
app.use('/api/program-categories', require('./routes/programCategory.routes'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mars Care Foundation API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
