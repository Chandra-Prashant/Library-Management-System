import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]); // New state for User List
    
    // State for Global Settings
    const [settings, setSettings] = useState({ 
        finePerDay: 0, 
        returnPeriodDays: 0 
    });
    
    // State for creating new staff
    const [staffData, setStaffData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'staff' 
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Get Books, Settings, and Users simultaneously
            const [bookRes, settingsRes, userRes] = await Promise.all([
                axios.get('http://localhost:5001/api/books'),
                axios.get('http://localhost:5001/api/settings'),
                axios.get('http://localhost:5001/api/users')
            ]);
            console.log("Users received from backend:", userRes.data);
            setBooks(bookRes.data);
            setSettings(settingsRes.data);
            setUsers(userRes.data);
        } catch (err) {
            console.error("Error fetching data");
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/settings', settings);
            alert("Global Library Rules Updated!");
            fetchData();
        } catch (err) {
            alert("Error updating settings");
        }
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/register', staffData);
            if (res.data.success) {
                alert("New Staff Account Created!");
                setStaffData({ name: '', email: '', password: '', role: 'staff' });
            
                // CRITICAL: Refresh the data so the new staff shows up in the table immediately
                await fetchData(); 
            }
        } catch (err) {
            console.error(err);
            alert("Error creating staff. Check if email is unique.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? Any books they have will be returned to the library.")) {
            try {
                await axios.delete(`http://localhost:5001/api/users/${userId}`);
                alert("User deleted successfully");
                fetchData();
            } catch (err) {
                alert("Error deleting user");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li onClick={() => window.location.reload()} style={{cursor:'pointer'}}>Dashboard Home</li>
                    <li onClick={handleLogout} style={{color: '#ff7675', marginTop: '20px', cursor: 'pointer'}}>Logout</li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h1>Administrator Dashboard</h1>
                </div>

                {/* SECTION 1: USER MANAGEMENT (STAFF & STUDENTS) */}
                <section className="inventory" style={{marginBottom: '40px', borderTop: '4px solid #3498db'}}>
                    <h3 style={{marginTop: '10px'}}>Registered Users (Staff & Students)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span style={{
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '0.8rem',
                                            backgroundColor: user.role === 'staff' ? '#d1ecf1' : '#fff3cd',
                                            color: user.role === 'staff' ? '#0c5460' : '#856404'
                                        }}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        {user.role !== 'admin' ? (
                                            <button 
                                                onClick={() => handleDeleteUser(user._id)}
                                                style={{backgroundColor: '#e74c3c', padding: '5px 10px', fontSize: '0.8rem'}}
                                            >
                                                Delete
                                            </button>
                                        ) : <i>System Admin</i>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                    {/* SECTION 2: GLOBAL LIBRARY RULES */}
                    <section className="form-card" style={{flex: 1, borderLeft: '5px solid #27ae60'}}>
                        <h3>Library Rules</h3>
                        <form onSubmit={handleUpdateSettings}>
                            <label>Fine per Day (₹)</label>
                            <input 
                                type="number" 
                                value={settings.finePerDay}
                                onChange={(e) => setSettings({...settings, finePerDay: e.target.value})} 
                                required 
                            />
                            <label>Return Period (Days)</label>
                            <input 
                                type="number" 
                                value={settings.returnPeriodDays}
                                onChange={(e) => setSettings({...settings, returnPeriodDays: e.target.value})} 
                                required 
                            />
                            <button type="submit" style={{backgroundColor: '#27ae60', marginTop: '10px'}}>Update Rules</button>
                        </form>
                    </section>

                    {/* SECTION 3: STAFF REGISTRATION */}
                    <section className="form-card" style={{flex: 1.5}}>
                        <h3>Quick Register: Staff</h3>
                        <form onSubmit={handleCreateStaff}>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={staffData.name}
                                onChange={(e) => setStaffData({...staffData, name: e.target.value})} 
                                required 
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={staffData.email}
                                onChange={(e) => setStaffData({...staffData, email: e.target.value})} 
                                required 
                            />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={staffData.password}
                                onChange={(e) => setStaffData({...staffData, password: e.target.value})} 
                                required 
                            />
                            <button type="submit" style={{backgroundColor: '#2c3e50', marginTop: '10px'}}>Add Staff Member</button>
                        </form>
                    </section>
                </div>

                {/* SECTION 4: BOOK MONITORING */}
                <section className="inventory">
                    <h3>Library Status & Automated Fines</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Issued To</th>
                                <th>Due Date</th>
                                <th>Current Fine (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book._id}>
                                    <td>{book.title}</td>
                                    <td style={{color: book.issuedTo ? '#e67e22' : '#999'}}>
                                        {book.issuedTo || 'Available'}
                                    </td>
                                    <td>
                                        {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : '—'}
                                    </td>
                                    <td style={{fontWeight: 'bold', color: book.fine > 0 ? '#e74c3c' : '#27ae60'}}>
                                        ₹{book.fine}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;