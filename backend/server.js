const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Import Models
const Book = require('./models/Book');
const User = require('./models/User');
const Settings = require('./models/Settings');
const app = express();
app.use(express.json());
app.use(cors());
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Connection Error:", err));

// --- USER AUTHENTICATION ROUTES ---
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration" });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ success: true, role: user.role, name: user.name, email: user.email });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
});
// --- BOOK MANAGEMENT ROUTES (WITH AUTOMATED FINES) ---
// Get all books with Dynamic Fine Calculation
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        // Fetch library settings for fine calculation
        let settings = await Settings.findOne();
        if (!settings) settings = { finePerDay: 10 }; // Fallback default
        const updatedBooks = books.map(book => {
            let currentFine = 0;
            if (book.status === 'Issued' && book.returnDate) {
                const today = new Date();
                const dueDate = new Date(book.returnDate);
                // Check if today is past the due date
                if (today > dueDate) {
                    const diffTime = Math.abs(today - dueDate);
                    // Convert milliseconds to days and round up
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    currentFine = diffDays * settings.finePerDay;
                }
            }
            // Return book object with the calculated fine (don't necessarily need to save to DB)
            return { ...book._doc, fine: currentFine };
        });
        res.json(updatedBooks);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: "Error adding book." });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});
// --- LIBRARY LOGIC (Issue/Return/Settings) ---
app.put('/api/books/issue/:id', async (req, res) => {
    try {
        const { studentEmail, returnDate } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            status: 'Issued',
            issuedTo: studentEmail,
            returnDate: returnDate,
            fine: 0 // Reset fine when newly issued
        }, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: "Error issuing book" });
    }
});
app.put('/api/books/return/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
            status: 'Available',
            issuedTo: null,
            returnDate: null,
            fine: 0 
        }, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ message: "Error returning book" });
    }
});
// Settings Endpoints
app.get('/api/settings', async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({ finePerDay: 10, returnPeriodDays: 14 });
    res.json(settings);
});
app.post('/api/settings', async (req, res) => {
    const { finePerDay, returnPeriodDays } = req.body;
    let settings = await Settings.findOneAndUpdate({}, 
        { finePerDay, returnPeriodDays }, 
        { new: true, upsert: true }
    );
    res.json(settings);
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));