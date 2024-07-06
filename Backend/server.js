require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const healthRoutes = require('./routes/healthRoutes');

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
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/health', healthRoutes);

// console.log(uri);

// MongoDB Connection
async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

run();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});