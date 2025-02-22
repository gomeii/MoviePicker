require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');

// Initialize Routes
const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Create Express App to Handle HTTP Requests
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection String
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not defined in .env file');
  process.exit(1);
}
console.log(`Connecting to MongoDB: ${uri}`);

// Logger
const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, ignore: 'pid,hostname' },
  },
});

// Attach Logger Middleware
const customLogger = pinoHttp({ logger: baseLogger });
app.use(customLogger);


// Routes
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/health', healthRoutes); // Health check route

// MongoDB Connection Function
async function connectDatabase(retries = 5, delay = 5000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await mongoose.connect(uri); // Corrected `uri` usage
      baseLogger.info('MongoDB connection established');
      return;
    } catch (error) {
      baseLogger.error({ error }, `MongoDB connection failed (Attempt ${attempt + 1})`);
      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        process.exit(1);
      }
    }
  }
}

// Start Server After DB Connection
async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => baseLogger.info(`Server running on port ${PORT}`));
}

// Graceful Shutdown Handling
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  baseLogger.info('MongoDB connection closed');
  process.exit(0);
});

// Run Server
if (require.main === module) {
  startServer();
}

module.exports = { app, baseLogger };