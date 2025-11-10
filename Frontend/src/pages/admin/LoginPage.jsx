// src/pages/admin/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp'; // Asumsi logo ada di sini

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // --- LOGIKA LOGIN (DUMMY) ---
        // Nanti kita ganti ini dengan cek ke database
        if (username === 'admin' && password === 'admin123') {
            alert('Login Berhasil!');
            // Nanti kita simpan token di sini
            navigate('/admin/dashboard'); // Arahkan ke dashboard
        } else {
            setError('Username atau Password salah!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="flex justify-center">
                    <img src={logo} alt="Logo" className="w-32 h-auto" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Admin Panel Login
                </h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label 
                            htmlFor="username" 
                            className="text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukan username"
                        />
                    </div>
                    <div>
                        <label 
                            htmlFor="password" 
                            className="text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Masukan password"
                        />
                    </div>
                    
                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;