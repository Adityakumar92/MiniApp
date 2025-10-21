const mongoose = require('mongoose');

const mongoDB_URL=process.env.mongoDB_URL_ENV;

if (!mongoDB_URL) {
  console.error('MONGO_URI not defined in environment variables.');
  process.exit(1);
}

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoDB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

connectToMongoDB();