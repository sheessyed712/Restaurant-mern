import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaPlus, FaMinus, FaShoppingBag, FaTrash } from 'react-icons/fa';

const CartDrawer = () => {
    const { cart, totalAmount, isCartOpen, setIsCartOpen, addToCart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                            <FaShoppingBag className="text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">
                            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" className="w-32 h-32 mx-auto mb-4 opacity-70" alt="Empty" />
                            <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
                            <p className="text-sm">Add items to get started!</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item._id} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <img src={item.imageUrl} className="w-20 h-20 rounded-xl object-cover shadow-sm" alt={item.name} />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{item.name}</h4>
                                        <p className="text-orange-600 font-bold text-sm">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1">
                                            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><FaMinus size={12} /></button>
                                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="text-green-600 hover:bg-green-50 p-1 rounded"><FaPlus size={12} /></button>
                                        </div>
                                        <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                        <div className="flex justify-between mb-4">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold text-xl text-gray-800">₹{totalAmount}</span>
                        </div>
                        <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;