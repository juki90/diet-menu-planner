require('dotenv').config();

const mongoose = require('mongoose');

const url = process.env.NODE_DATABASE;

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopopology: true,
      useCreateIndex: true,
      ssl: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    return process.exit(1);
  }
};

module.exports = connectDB;
