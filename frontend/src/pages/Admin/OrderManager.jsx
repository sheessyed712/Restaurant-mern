import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaCheckCircle, FaUtensils, FaConciergeBell, FaMoneyBillWave, FaPhoneAlt, FaHashtag } from 'react-icons/fa';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        const res = await axios.get('http://localhost:5000/api/orders');
        setOrders(res.data);
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
            fetchOrders();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const statusConfig = {
        'Pending': { icon: <FaClock />, color: 'bg-yellow-100 text-yellow-700 border-yellow-300', btn: 'bg-yellow-500 hover:bg-yellow-600' },
        'Confirmed': { icon: <FaCheckCircle />, color: 'bg-blue-100 text-blue-700 border-blue-300', btn: 'bg-blue-500 hover:bg-blue-600' },
        'Preparing': { icon: <FaUtensils />, color: 'bg-orange-100 text-orange-700 border-orange-300', btn: 'bg-orange-500 hover:bg-orange-600' },
        'Served': { icon: <FaConciergeBell />, color: 'bg-green-100 text-green-700 border-green-300', btn: 'bg-green-500 hover:bg-green-600' },
        'Paid': { icon: <FaMoneyBillWave />, color: 'bg-gray-100 text-gray-700 border-gray-300', btn: 'bg-gray-400' }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Live Orders</h1>
                    <p className="text-gray-500">Manage and track order status in real-time</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map(order => (
                    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Header */}
                        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg font-bold">
                                    <FaHashtag />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg">{order.orderId}</h2>
                                    <p className="text-xs text-gray-400">Table {order.tableNumber}</p>
                                </div>
                            </div>
                            
                            <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${statusConfig[order.status]?.color}`}>
                                {statusConfig[order.status]?.icon}
                                {order.status}
                            </span>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-4">
                                <h4 className="text-xs text-gray-400 font-semibold uppercase mb-2">Order Items</h4>
                                <div className="space-y-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {item.quantity}
                                                </span>
                                                <span className="text-gray-700 font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-gray-500">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center text-sm">
                                <div className="flex items-center text-gray-500">
                                    <FaPhoneAlt className="mr-2 text-xs" /> {order.whatsappNumber}
                                </div>
                                <div className="font-bold text-lg text-gray-800">
                                    Total: <span className="text-green-600">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
                            {order.status !== 'Pending' && (
                                <button onClick={() => updateStatus(order._id, 'Pending')} className="px-3 py-1.5 text-xs font-bold text-yellow-700 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition">
                                    Reset
                                </button>
                            )}
                            {order.status !== 'Confirmed' && order.status !== 'Paid' && (
                                <button onClick={() => updateStatus(order._id, 'Confirmed')} className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition ${statusConfig['Confirmed'].btn}`}>
                                    Confirm
                                </button>
                            )}
                            {order.status !== 'Preparing' && order.status !== 'Paid' && order.status !== 'Served' && (
                                <button onClick={() => updateStatus(order._id, 'Preparing')} className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition ${statusConfig['Preparing'].btn}`}>
                                    Preparing
                                </button>
                            )}
                            {order.status !== 'Served' && order.status !== 'Paid' && (
                                <button onClick={() => updateStatus(order._id, 'Served')} className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition ${statusConfig['Served'].btn}`}>
                                    Served
                                </button>
                            )}
                             {order.status !== 'Paid' && (
                                <button onClick={() => updateStatus(order._id, 'Paid')} className={`px-3 py-1.5 text-xs font-bold text-white rounded-lg transition bg-gray-800 hover:bg-gray-900`}>
                                    Mark Paid
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManager;