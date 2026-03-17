import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaEdit, FaPepperHot, FaLeaf } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MenuManager = () => {
    const [dishes, setDishes] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: 'Starters', imageUrl: '', isVeg: true });

    const fetchDishes = async () => {
        const res = await axios.get('https://restaurant-mern-1-flnm.onrender.com/api/dishes/all');
        setDishes(res.data);
    };

    useEffect(() => { fetchDishes(); }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://restaurant-mern-1-flnm.onrender.com/api/dishes', formData);
            toast.success("Dish Added Successfully!");
            fetchDishes();
            setFormData({ name: '', description: '', price: '', category: 'Starters', imageUrl: '', isVeg: true });
        } catch (err) {
            toast.error("Error adding dish");
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        await axios.put(`https://restaurant-mern-1-flnm.onrender.com/api/dishes/${id}`, { isAvailable: !currentStatus });
        toast.info("Availability Updated");
        fetchDishes();
    };

    const deleteDish = async (id) => {
        if(window.confirm("Delete this dish permanently?")) {
            await axios.delete(`https://restaurant-mern-1-flnm.onrender.com/api/dishes/${id}`);
            toast.error("Dish Deleted");
            fetchDishes();
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Menu Management</h1>
            
            {/* Add New Form - Card Style */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-700">
                    <FaPlus className="text-orange-500" /> Add New Dish
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase">Dish Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Butter Chicken" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase">Price (₹)</label>
                        <input name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 350" type="number" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-gray-500 font-semibold uppercase">Image URL</label>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 font-semibold uppercase">Category</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white transition">
                            <option>Starters</option>
                            <option>Main Course</option>
                            <option>Desserts</option>
                            <option>Beverages</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl w-full hover:bg-gray-50 transition">
                            <input type="checkbox" name="isVeg" checked={formData.isVeg} onChange={handleInputChange} className="w-5 h-5 accent-green-500" />
                            <span className="font-medium text-gray-700">Vegetarian</span>
                        </label>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                         <label className="text-xs text-gray-500 font-semibold uppercase">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description of the dish..." className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" required></textarea>
                    </div>
                    <button type="submit" className="col-span-1 md:col-span-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-orange-100">
                        Add to Menu
                    </button>
                </form>
            </div>

            {/* Dishes List - Swiggy Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dishes.map(dish => (
                    <div key={dish._id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col ${!dish.isAvailable ? 'opacity-60' : ''}`}>
                        <div className="relative h-40">
                            <img src={dish.imageUrl} className="w-full h-full object-cover" alt={dish.name} />
                            <div className="absolute top-3 left-3">
                                <span className={`text-white p-1 rounded-sm ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {dish.isVeg ? <FaLeaf size={10} /> : <FaPepperHot size={10} />}
                                </span>
                            </div>
                            {!dish.isAvailable && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg tracking-wider">SOLD OUT</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-800 text-lg truncate w-3/4">{dish.name}</h3>
                                <span className="text-sm font-bold text-green-700">₹{dish.price}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider">{dish.category}</p>
                            <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{dish.description}</p>
                            
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                <button onClick={() => toggleAvailability(dish._id, dish.isAvailable)} className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg transition ${dish.isAvailable ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                    {dish.isAvailable ? <FaToggleOn size={18}/> : <FaToggleOff size={18}/>}
                                    {dish.isAvailable ? 'Active' : 'Enable'}
                                </button>
                                <button onClick={() => deleteDish(dish._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuManager;