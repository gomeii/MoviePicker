require('dotenv').config();
const express = require('express');

const pino = require('pino');
const pinoHttp = require('pino-http');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Routes
const searchRoutes = require('./routes/searchRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Create Express App to Handle HTTP Requests
const app = express();
const PORT = 5000; 
const uri = process.env.MONGO_URI;
const clientOptions = { 
serverApi: { 
  version: '1',
  strict: true, 
  useUnifiedTopology: true,
  deprecationErrors: false, 
  useNewUrlParser: true,
  useFindAndModify: false,
  createIndexes: true
 }
};

// Create Base Logger
const baseLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
      target: 'pino-pretty',
      options: {
          colorize: true,
          ignore: 'pid,hostname',
      },
  },
});

// HTTP Logger Middleware
const customLogger = pinoHttp({
  logger: baseLogger,
  // Customize the request logs to include only specific fields
  customSuccessMessage: (req, res) => `Request: ${req.method} ${req.url} | Status: ${res.statusCode}`,
  customErrorMessage: (req, res, err) => `Error on ${req.method} ${req.url} | Status: ${res.statusCode} | Error: ${err.message}`,
  serializers: {
    req(req) {
      // Slim down the logged fields for requests
      return {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'], // Only log the user-agent if required
      };
    },
    res(res) {
      // Slim down the logged fields for responses
      return {
        statusCode: res.statusCode,
      };
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(customLogger);
// Routes
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
// app.use('/api/health', healthRoutes);

// MongoDB Connection Function Definition
async function ConnectDatabase() {
  try {
    await mongoose.connect(uri, clientOptions);
    customLogger.logger.info('MongoDB connection established');
    if (require.main === module) {
      app.listen(PORT, () => {
        customLogger.logger.info(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    customLogger.logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Run MongoDb Connection
ConnectDatabase();

module.exports = { app, baseLogger };  // Export the app without starting the server