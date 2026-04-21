import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/register', formData);
            alert("Student Account Created! Please Login.");
            navigate('/');
        } catch (err) {
            alert("Invalid Email or Password.");
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-form" onSubmit={handleRegister}>
                <h2>Student Sign Up</h2>
                <input type="text" placeholder="Full Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Student Email" onChange={(e)=>setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Create Password" onChange={(e)=>setFormData({...formData, password: e.target.value})} required />
                <button type="submit" className="login-btn">Register</button>
            </form>
        </div>
    );
};
export default Register;