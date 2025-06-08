import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    /** @type {mongoose.ConnectOptions} */
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10, // Maintain up to 10 socket connections
      connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
    };

    try {
      // Extract database name from connection string or use default
      const uri = process.env.MONGODB_URI;
      const dbName = uri.includes('/quickcart') ? '' : '/quickcart';
      
      cached.promise = mongoose
        .connect(`${uri}${dbName}`, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          return mongoose;
        })
        .catch(err => {
          console.error('MongoDB connection error:', err);
          throw err;
        });
    } catch (error) {
      console.error('Error in MongoDB connection setup:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to resolve MongoDB connection:', error);
    throw error;
  }
}

export default connectDB;
 