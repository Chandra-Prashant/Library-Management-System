const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    status: { type: String, default: 'Available' }, // Available or Issued
    issuedTo: { type: String, default: null },      // Student Email
    dueDate: { type: Date, default: null },
    fine: { type: Number, default: 0 }
});

module.exports = mongoose.model('Book', BookSchema);
