const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const existingAdmin = await User.findOne({ email: 'admin@lib.com' });
        if (existingAdmin) {
            console.log("Admin already exists!");
        } else {
            const admin = new User({
                name: "Super Admin",
                email: "admin@lib.com",
                password: "admin",
                role: "admin"
            });
            await admin.save();
            console.log("Admin Created: admin@lib.com / admin");
        }
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error:", err);
    }
};
createAdmin();