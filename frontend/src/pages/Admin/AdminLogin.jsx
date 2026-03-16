import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaUserShield, FaUtensils } from 'react-icons/fa';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) return toast.error("Please fill in all fields");
        
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/login', { username, password });
            
            // Save token and user to local storage
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminUser', res.data.admin.username);
            
            toast.success("Login Successful!");
            navigate('/admin');
        } catch (err) {
            toast.error(err.response?.data?.msg || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                
                {/* Logo / Branding - Matching Dashboard Style */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mb-4">
                        <FaUtensils className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Galaxy Restaurant</h1>
                    <p className="text-gray-500 text-sm mt-1">Admin Portal</p>
                </div>

                {/* Login Card - Matching Dashboard Card Style */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <FaUserShield className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-800">Secure Sign In</h2>
                            <p className="text-xs text-gray-400">Enter your credentials to continue</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button - Matching Dashboard Button Style */}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Protected by Encrypted Authentication
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;