import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaRupeeSign, FaShoppingCart, FaChartPie, FaArrowUp, FaClock } from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, avgOrderValue: 0, dailySales: [] });

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('https://restaurant-mern-1-flnm.onrender.com/api/orders/analytics');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAnalytics();
    }, []);

    const chartData = Object.keys(stats.dailySales || {}).map(date => ({
        date,
        sales: stats.dailySales[date]
    }));

    // Custom Tooltip for Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="text-orange-600 font-bold text-lg">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500">Track your restaurant's performance metrics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                            <h2 className="text-3xl font-bold text-gray-800 mt-2 flex items-center">
                                <span className="text-lg mr-1">₹</span>
                                {stats.totalSales.toLocaleString()}
                            </h2>
                        </div>
                        <div className="bg-green-100 p-3 rounded-xl">
                            <FaRupeeSign className="text-green-600 text-xl" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-600 text-sm">
                        <FaArrowUp className="mr-1" />
                        <span>+12.5% from last month</span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                            <h2 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalOrders}</h2>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <FaShoppingCart className="text-blue-600 text-xl" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Updated just now</p>
                    </div>
                </div>

                {/* Avg Value Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg. Order Value</p>
                            <h2 className="text-3xl font-bold text-gray-800 mt-2">₹{stats.avgOrderValue}</h2>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <FaChartPie className="text-purple-600 text-xl" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Per transaction average</p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Revenue Trends</h3>
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                
                {chartData.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={1}/>
                                        <stop offset="95%" stopColor="#fdba74" stopOpacity={0.4}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249, 115, 22, 0.05)' }} />
                                <Bar dataKey="sales" fill="url(#colorUv)" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <FaClock className="mx-auto text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-400 font-medium">No sales data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;