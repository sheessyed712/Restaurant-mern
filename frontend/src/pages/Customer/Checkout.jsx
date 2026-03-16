import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const Checkout = () => {
    const { cart, total, clearCart, addToCart, removeFromCart } = useCart();
    const [tableNumber, setTableNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOrder = async () => {
        if (!tableNumber || !whatsappNumber) return toast.error("Please fill all details");
        if (cart.length === 0) return toast.error("Cart is empty");
        
        setLoading(true);
        const items = cart.map(item => ({ dishId: item._id, quantity: item.quantity }));

        try {
            const res = await axios.post('http://localhost:5000/api/orders/place', {
                tableNumber, whatsappNumber, items
            });
            
            if (res.data.isNew) {
                toast.success("Order Placed Successfully!");
            } else {
                toast.success("Items added to your existing active order!");
            }
            
            clearCart();
            // Navigate to track page with state
            navigate('/track', { state: { orderId: res.data.order.orderId, phone: whatsappNumber } });
        } catch (err) {
            toast.error("Error placing order");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4">
            <div className="max-w-lg mx-auto pt-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white shadow rounded-full hover:bg-gray-50">
                        <FaArrowLeft />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-gray-100">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Table Number</label>
                            <input 
                                type="text" 
                                value={tableNumber}
                                onChange={(e) => setTableNumber(e.target.value)}
                                className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium bg-gray-50"
                                placeholder="e.g., T12"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp Number</label>
                            <input 
                                type="text" 
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                className="block w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium bg-gray-50"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item._id} className="flex items-center gap-4">
                                <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                                    <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                    <button onClick={() => removeFromCart(item._id)} className="p-1 text-orange-500 hover:bg-orange-100 rounded"><FaMinus size={12}/></button>
                                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="p-1 text-green-600 hover:bg-green-100 rounded"><FaPlus size={12}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between font-bold text-xl text-gray-800">
                            <span>Total</span>
                            <span className="text-orange-600">₹{total}</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50"
                >
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Checkout;