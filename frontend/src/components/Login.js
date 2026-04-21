import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:5001/api/login', { email, password });
        if (res.data.success) {
            // SAVE EMAIL TO LOCAL STORAGE
            localStorage.setItem('userEmail', res.data.email);
            navigate(`/${res.data.role}`);
        }
    } catch (err) {
        alert("Invalid Credentials");
    }
};
    return (
        <div className="login-wrapper">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Library Login</h1>
                <div className="input-group">
                    <label>Email ID</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                    <p>New user?</p>
                    <button 
                        type="button" 
                        onClick={() => navigate('/register')}
                        style={{ backgroundColor: '#34495e', marginTop: '5px' }}
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;