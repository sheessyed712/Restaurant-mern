import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { FaSearch, FaStar, FaPlus, FaMinus } from 'react-icons/fa';

const Menu = () => {
    const [dishes, setDishes] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('All');
    const [activeType, setActiveType] = useState('All');
    const { cart, addToCart, removeFromCart } = useCart();

    useEffect(() => {
        axios.get('http://localhost:5000/api/dishes')
            .then(res => setDishes(res.data))
            .catch(err => console.error(err));
    }, []);

    const categories = ['All', ...new Set(dishes.map(d => d.category))];

    const filteredDishes = dishes.filter(dish => {
        const matchSearch = dish.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCat === 'All' || dish.category === activeCat;
        const matchType = activeType === 'All' || 
                         (activeType === 'Veg' && dish.isVeg) || 
                         (activeType === 'Non-Veg' && !dish.isVeg);
        return matchSearch && matchCat && matchType;
    });

    const getQty = (id) => cart.find(item => item._id === id)?.quantity || 0;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white pt-10 pb-24 px-4 md:px-10 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full"></div>
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2">What's on your mind?</h1>
                    <p className="text-orange-100 text-lg mb-6">Order your favorite food instantly.</p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search for dishes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Filters & Content Container */}
            <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-14">
                
                {/* Filter Pills Card */}
                <div className="bg-white rounded-2xl shadow-md p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-2 z-10">
                    <div className="flex overflow-x-auto gap-3 pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm ${
                                    activeCat === cat 
                                    ? 'bg-gray-900 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Veg/Non-Veg Toggle */}
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                        <button onClick={() => setActiveType('All')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activeType === 'All' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}>All</button>
                        <button onClick={() => setActiveType('Veg')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${activeType === 'Veg' ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}>
                            <span className="w-3 h-3 border border-green-500 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span></span> Veg
                        </button>
                        <button onClick={() => setActiveType('Non-Veg')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${activeType === 'Non-Veg' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}>
                            <span className="w-3 h-3 border border-red-500 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span></span> Non-Veg
                        </button>
                    </div>
                </div>

                {/* Dishes List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-24">
                    {filteredDishes.length === 0 ? (
                        <div className="col-span-2 text-center py-16 text-gray-400">
                            <img src="https://cdn-icons-png.flaticon.com/512/3094/3094933.png" className="w-32 h-32 mx-auto mb-4 opacity-60" alt="No items" />
                            <p className="text-xl font-medium">No dishes found</p>
                        </div>
                    ) : (
                        filteredDishes.map(dish => {
                            const qty = getQty(dish._id);
                            const isAvailable = dish.isAvailable;

                            return (
                                <div key={dish._id} className={`bg-white rounded-2xl shadow-sm p-4 flex gap-4 border border-gray-100 transition duration-300 group relative overflow-hidden`}>
                                    
                                    {/* UNAVAILABLE OVERLAY - Styled like Admin/Swiggy */}
                                    {!isAvailable && (
                                        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                                            <span className="bg-gray-800 text-gray-200 text-xs font-bold px-4 py-2 rounded-full tracking-wider shadow-lg">
                                                SOLD OUT
                                            </span>
                                        </div>
                                    )}

                                    {/* Image */}
                                    <div className="relative w-36 h-36 md:w-44 md:h-40 flex-shrink-0 rounded-xl overflow-hidden">
                                        <img 
                                            src={dish.imageUrl} 
                                            alt={dish.name}
                                            className={`w-full h-full object-cover group-hover:scale-105 transition duration-300 ${!isAvailable ? 'grayscale opacity-80' : ''}`}
                                        />
                                        {/* Veg/Non-Veg Badge */}
                                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm p-0.5 rounded z-20">
                                            <span className={`w-4 h-4 border-2 ${dish.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
                                                <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-col justify-between py-1 flex-grow relative z-0">
                                        <div>
                                            <h3 className={`text-lg font-bold mb-1 ${!isAvailable ? 'text-gray-400' : 'text-gray-800'}`}>{dish.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                                <span className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                                                    4.2 <FaStar size={8} />
                                                </span>
                                                <span>35-40 mins</span>
                                            </div>
                                            <p className="text-gray-400 text-sm line-clamp-2">{dish.description}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`text-xl font-bold ${!isAvailable ? 'text-gray-400' : 'text-gray-800'}`}>₹{dish.price}</span>
                                            
                                            {/* Action Button */}
                                            {isAvailable ? (
                                                <>
                                                    {qty === 0 ? (
                                                        <button 
                                                            onClick={() => addToCart(dish)}
                                                            className="px-8 py-2 border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition text-sm"
                                                        >
                                                            ADD
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-1 py-1 shadow-inner">
                                                            <button onClick={() => removeFromCart(dish._id)} className="text-orange-500 text-lg font-bold hover:bg-orange-50 p-1 rounded"><FaMinus /></button>
                                                            <span className="text-base font-bold text-gray-800 w-4 text-center">{qty}</span>
                                                            <button onClick={() => addToCart(dish)} className="text-green-600 text-lg font-bold hover:bg-green-50 p-1 rounded"><FaPlus /></button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <button disabled className="px-6 py-2 bg-gray-200 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
                                                    Unavailable
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default Menu;