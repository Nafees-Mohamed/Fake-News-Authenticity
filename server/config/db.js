const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fakenews_db';
  const fallbackUri = 'mongodb://127.0.0.1:27017/fakenews_db';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Cloud Connection Error]: ${error.message}`);

    if (primaryUri !== fallbackUri) {
      console.log(`[MongoDB Fallback] Attempting connection to local MongoDB database...`);
      try {
        const localConn = await mongoose.connect(fallbackUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`[MongoDB Connected] Local Host: ${localConn.connection.host}`);
        return;
      } catch (fallbackErr) {
        console.warn(`[Local MongoDB Error]: ${fallbackErr.message}`);
      }
    }

    console.log(`\n======================================================`);
    console.log(`[TO FIX MONGODB ATLAS CLOUD CONNECTION]:`);
    console.log(`1. Open MongoDB Atlas (https://cloud.mongodb.com)`);
    console.log(`2. Go to Security > Network Access`);
    console.log(`3. Click "Add IP Address" -> Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)`);
    console.log(`======================================================\n`);
  }
};

module.exports = connectDB;
