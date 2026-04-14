const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function verifyConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI not found in backend/.env');
    process.exit(1);
  }

  console.log('--- Checking Connection ---');
  console.log('URI detected: ' + uri.split('@')[1]); // Log everything after @ to avoid exposing password
  console.log('---------------------------');

  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000 
    });
    console.log('✅ Connection Successful!');
    console.log('Database connected: ' + mongoose.connection.name);
    
    // Test collection access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections Found:');
    collections.forEach(c => console.log(' - ' + c.name));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Failed!');
    if (err.name === 'MongoAuthenticationError') {
      console.error('Error: Authentication Failed. (Wrong username or password)');
    } else if (err.name === 'MongoServerSelectionError') {
      console.error('Error: Server Selection Timeout. (Check IP Whitelist / Network)');
    } else {
      console.error('Error Type: ' + err.name);
      console.error('Error Message: ' + err.message);
    }
    process.exit(1);
  }
}

verifyConnection();
