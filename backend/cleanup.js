const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Settings = require('./models/Settings');
require('dotenv').config();
const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        // 1. Clear Books
        await Book.deleteMany({});
        console.log("All books removed.");
        // 2. Clear Students and Staff, but KEEP the Admin
        await User.deleteMany({ role: { $ne: 'admin' } });
        console.log("All Students and Staff removed. Admin preserved.");
        // 3. Reset Fines/Settings
        await Settings.deleteMany({});
        console.log("Library settings reset.");
        mongoose.connection.close();
    } catch (err) {
        console.error("Cleanup failed:", err);
    }
};
cleanup();