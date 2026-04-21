import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    
    // States for Adding a Book
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [isbn, setIsbn] = useState('');

    // States for Issuing a Book
    const [selectedBookId, setSelectedBookId] = useState('');
    const [studentEmail, setStudentEmail] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const res = await axios.get('http://localhost:5001/api/books');
        setBooks(res.data);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/books', { title, author, isbn });
            alert("Book Added!");
            fetchBooks();
        } catch (err) { alert("Error adding book."); }
    };

    const handleIssueBook = async () => {
    
    // 1. Get settings first
    const settingsRes = await axios.get('http://localhost:5001/api/settings');
    const daysAllowed = settingsRes.data.returnPeriodDays;
    
    // 2. Calculate date
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + parseInt(daysAllowed));
    
    // 3. Issue
    await axios.put(`http://localhost:5001/api/books/issue/${selectedBookId}`, {
        studentEmail,
        returnDate
    });
    alert(`Issued! Due date is: ${returnDate.toDateString()}`);
    fetchBooks();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5001/api/books/${id}`);
        fetchBooks();
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Staff Panel</h2>
                <ul>
                    <li onClick={() => window.location.reload()}>Inventory & Issue</li>
                    <li onClick={() => navigate('/')} style={{color: '#ff7675'}}>Logout</li>
                </ul>
            </div>

            <div className="main-content">
                <h1>Library Management</h1>

                <div style={{display: 'flex', gap: '20px'}}>
                    {/* ADD BOOK SECTION */}
                    <div className="form-card" style={{flex: 1}}>
                        <h3>Add New Book</h3>
                        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                        <input placeholder="Author" value={author} onChange={(e)=>setAuthor(e.target.value)} />
                        <input placeholder="ISBN" value={isbn} onChange={(e)=>setIsbn(e.target.value)} />
                        <button onClick={handleAddBook}>Add Book</button>
                    </div>

                    {/* ISSUE BOOK SECTION */}
                    <div className="form-card" style={{flex: 1, borderLeft: '4px solid #3498db'}}>
                        <h3>Issue Book to Student</h3>
                        <select onChange={(e) => setSelectedBookId(e.target.value)}>
                            <option value="">Select Available Book</option>
                            {books.filter(b => b.status === 'Available').map(book => (
                                <option key={book._id} value={book._id}>{book.title} ({book.isbn})</option>
                            ))}
                        </select>
                        <input 
                            placeholder="Student Email ID" 
                            value={studentEmail} 
                            onChange={(e) => setStudentEmail(e.target.value)} 
                        />
                        <button onClick={handleIssueBook} style={{backgroundColor: '#3498db'}}>Issue Book</button>
                    </div>
                </div>
                
                {/* INVENTORY TABLE */}
                <div className="inventory">
                    <h3>Library Inventory</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Issued To</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book._id}>
                                    <td>{book.title}</td>
                                    <td style={{color: book.status === 'Available' ? 'green' : 'red'}}>{book.status}</td>
                                    <td>{book.issuedTo || '—'}</td>
                                    <td>
                                        <button className="logout-btn" onClick={() => handleDelete(book._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;