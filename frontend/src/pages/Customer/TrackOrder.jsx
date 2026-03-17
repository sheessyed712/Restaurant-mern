import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaUtensils, FaCheckCircle, FaConciergeBell, FaMoneyBillWave, FaClock, FaArrowLeft, FaPlus, FaCode } from 'react-icons/fa';

const TrackOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState(location.state?.orderId || location.state?.phone || '');
    const [orders, setOrders] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (location.state?.orderId || location.state?.phone) {
            handleTrack();
        }
    }, [location.state]);

    const handleTrack = async () => {
        if (!query) return;
        try {
            const res = await axios.post('https://restaurant-mern-1-flnm.onrender.com/api/orders/track', { query });
            setOrders(res.data);
            setSearched(true);
        } catch (err) {
            console.error(err);
        }
    };

    const statusSteps = [
        { key: 'Pending', icon: <FaClock />, label: 'Received' },
        { key: 'Confirmed', icon: <FaCheckCircle />, label: 'Confirmed' },
        { key: 'Preparing', icon: <FaUtensils />, label: 'Cooking' },
        { key: 'Served', icon: <FaConciergeBell />, label: 'Served' }
        // Removed 'Paid' from customer timeline as they won't see paid orders
    ];

    const getStatusIndex = (status) => statusSteps.findIndex(s => s.key === status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full filter blur-3xl opacity-30 -z-0"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100 rounded-full filter blur-3xl opacity-30 -z-0"></div>

            <div className="max-w-xl mx-auto pt-4 relative z-10">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/')} className="p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition">
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Track Order</h2>
                </div>

                {/* Search Box */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition hover:shadow-md">
                    <p className="text-sm text-gray-500 mb-3">Enter your <b>Table Number</b> or <b>Phone Number</b> to see your active orders.</p>
                    <div className="flex gap-3">
                        <input 
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. T5 or 9876543210"
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                        />
                        <button 
                            onClick={handleTrack}
                            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 rounded-xl font-semibold hover:shadow-md transition flex items-center gap-2"
                        >
                            <FaSearch /> Find
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {searched && orders.length === 0 && (
                        <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100">
                            <img src="https://cdn-icons-png.flaticon.com/512/2762/2762826.png" className="w-24 h-24 mx-auto mb-4 opacity-60" alt="Not found" />
                            <p className="font-semibold text-gray-800 text-lg">No Active Orders Found</p>
                            <p className="text-sm text-gray-400 mb-6">Your order might be completed or the details are incorrect.</p>
                            <button onClick={() => navigate('/')} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition">
                                Start New Order
                            </button>
                        </div>
                    )}

                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden transition hover:shadow-lg">
                            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">Order #{order.orderId}</h3>
                                    <p className="text-xs text-gray-500">Table {order.tableNumber} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                                    order.status === 'Served' ? 'bg-green-100 text-green-700' : 
                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Progress Timeline */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="relative flex justify-between">
                                    {statusSteps.map((step, idx) => {
                                        const currentIdx = getStatusIndex(order.status);
                                        const isActive = idx <= currentIdx;
                                        const isCurrent = idx === currentIdx;
                                        
                                        return (
                                            <div key={step.key} className="flex flex-col items-center relative z-10 w-1/4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                                    isActive ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-200 text-gray-300'
                                                } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}>
                                                    {step.icon}
                                                </div>
                                                <p className={`text-xs mt-2 font-medium text-center ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>{step.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Items Details */}
                            <div className="p-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Order Items</h4>
                                <div className="space-y-2">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 bg-gray-100 rounded text-xs flex items-center justify-center font-bold text-gray-600">{item.quantity}</span>
                                                <span className="text-gray-700">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-gray-600">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-orange-600">₹{order.totalAmount}</span>
                                </div>
                                
                                {/* Add More Items Button */}
                                {order.status !== 'Paid' && (
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="mt-6 w-full py-3 border-2 border-dashed border-orange-300 rounded-xl text-orange-600 font-semibold flex items-center justify-center gap-2 hover:bg-orange-50 transition"
                                    >
                                        <FaPlus /> Add More Items
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Developer Details in Footer */}
                <div className="text-center mt-12 mb-4 text-gray-400 text-xs flex items-center justify-center gap-1">
                    <FaCode /> Developed by :<span className="font-bold text-gray-600 ml-1">Syed Shees Ahamed</span>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;