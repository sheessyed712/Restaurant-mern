import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (dish) => {
        setCart(prev => {
            const exist = prev.find(item => item._id === dish._id);
            if (exist) {
                return prev.map(item => item._id === dish._id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...dish, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const updateQuantity = (id, qty) => {
        if(qty < 1) {
            removeFromCart(id);
        } else {
            setCart(prev => prev.map(item => item._id === id ? {...item, quantity: qty} : item));
        }
    };

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems, totalAmount, isCartOpen, setIsCartOpen, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);