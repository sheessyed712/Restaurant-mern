import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaMapMarkerAlt, FaUtensils, FaHeart } from 'react-icons/fa';

const Layout = () => {
    const { totalItems, setIsCartOpen } = useCart();

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Left: Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            <FaUtensils />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-slate-800">Galaxy Restaurant</h1>
                            <div className="flex items-center text-xs text-slate-500 gap-1">
                                <FaMapMarkerAlt className="text-orange-500" />
                                <span>Scan & Order</span>
                            </div>
                        </div>
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <Link to="/track" className="text-sm font-medium text-slate-600 hover:text-orange-600 hidden md:block transition-colors">
                            Track Order
                        </Link>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 shadow-sm"
                        >
                            <FaShoppingCart className="text-orange-600 text-xl" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                            <span className="hidden md:block font-bold text-slate-700">Cart</span>
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer with Developer Details */}
            <footer className="bg-white border-t border-gray-100 mt-10 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                        <span>Developer details:</span>
                       
                        <span><span className="font-bold text-orange-600">Syed Shees Ahamed</span></span>
                    </div>
                    <p className="text-xs text-gray-400">© 2026 Galaxy Restaurant System. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                        <a href="#" className="hover:text-orange-600">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-orange-600">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;