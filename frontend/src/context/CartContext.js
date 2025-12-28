import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    // Load cart from local storage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('basho_cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error parsing cart from local storage:', error);
            }
        }
    }, []);

    // Update local storage and calculations whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('basho_cart', JSON.stringify(cartItems));

        // Calculate total price
        const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        setCartTotal(total);

        // Calculate total item count
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.product_id);

            if (existingItem) {
                // Increment quantity if item exists
                return prevItems.map(item =>
                    item.id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item
                return [...prevItems, {
                    id: product.product_id,
                    name: product.name,
                    price: product.price,
                    image: product.image_url_full || product.image || '/images/products/placeholder.jpg',
                    quantity: 1,
                    category: product.category
                }];
            }
        });
        setIsCartOpen(true); // Open drawer when item added
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    const openCart = () => {
        setIsCartOpen(true);
    };

    const value = {
        cartItems,
        isCartOpen,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        closeCart,
        openCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
