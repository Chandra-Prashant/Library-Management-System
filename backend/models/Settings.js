const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    finePerDay: { type: Number, default: 10 },
    returnPeriodDays: { type: Number, default: 14 }
});

module.exports = mongoose.model('Settings', SettingsSchema);