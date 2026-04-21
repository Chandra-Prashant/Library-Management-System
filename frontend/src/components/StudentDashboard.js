import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Retrieves the logged-in student's email
    const studentEmail = localStorage.getItem('userEmail') || 'student@test.com';

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const res = await axios.get('http://localhost:5001/api/books');
        setBooks(res.data);
    };

    const handleIssueBook = async (bookId) => {
        try {
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 14); // 2-week deadline

            await axios.put(`http://localhost:5001/api/books/issue/${bookId}`, {
                studentEmail: studentEmail,
                returnDate: returnDate
            });
            alert("Book Issued Successfully!");
            fetchBooks(); 
        } catch (err) {
            alert("Error issuing book.");
        }
    };

    const handleReturnBook = async (bookId) => {
        try {
            await axios.put(`http://localhost:5001/api/books/return/${bookId}`);
            alert("Book returned successfully!");
            fetchBooks(); 
        } catch (err) {
            alert("Error returning book.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // Filter logic for the search bar
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Student Library</h2>
                <ul>
                    <li onClick={() => window.location.reload()}>Browse Books</li>
                    <li onClick={handleLogout} style={{color: '#ff7675', marginTop: '20px', cursor: 'pointer'}}>Logout</li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1>Student Portal</h1>
                    <div className="user-info">
                        <strong>Logged in as:</strong> {studentEmail}
                    </div>
                </div>

                <div className="form-card" style={{maxWidth: '100%'}}>
                    <h3>Search for a Book</h3>
                    <input 
                        type="text" 
                        placeholder="Type book name or author..." 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="inventory">
                    <h3>Library Catalogue</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Fine Due</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book._id}>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td style={{fontWeight: 'bold', color: book.status === 'Available' ? '#27ae60' : '#e67e22'}}>
                                        {book.status}
                                    </td>
                                    <td>
                                        {/* Only show fine if the book is issued to THIS student */}
                                        {book.issuedTo === studentEmail ? `₹${book.fine}` : '—'}
                                    </td>
                                    <td>
                                        {book.status === 'Available' ? (
                                            <button onClick={() => handleIssueBook(book._id)}>Issue Book</button>
                                        ) : book.issuedTo === studentEmail ? (
                                            <button 
                                                onClick={() => handleReturnBook(book._id)} 
                                                style={{backgroundColor: '#e67e22'}}
                                            >
                                                Return Book
                                            </button>
                                        ) : (
                                            <button disabled style={{backgroundColor: '#ccc', cursor: 'not-allowed'}}>
                                                Issued
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBooks.length === 0 && <p style={{marginTop: '20px', textAlign: 'center'}}>No books found matching your search.</p>}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;