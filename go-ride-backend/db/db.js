const mongoose = require('mongoose');

let isConnected = false;

async function connectToDb() {
    if (isConnected) {
        console.log("🔄 Using existing database connection.");
        return;
    }
    try {
        await mongoose.connect(process.env.DB_CONNECT, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        isConnected = true;
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Database Connection Error:", err);
        process.exit(1);
    }
}

module.exports = connectToDb;
