import React from 'react';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ onNavigate }) => {
    const {
        isCartOpen,
        closeCart,
        cartItems,
        cartTotal,
        updateQuantity,
        removeFromCart
    } = useCart();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        // Placeholder for checkout logic
        alert('Checkout functionality coming soon!');
        // closeCart();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cart-backdrop ${isCartOpen ? 'open' : ''}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>Your Bag ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                    <button className="close-btn" onClick={closeCart}>&times;</button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your bag is empty.</p>
                            <button
                                className="btn-text"
                                onClick={() => {
                                    closeCart();
                                    if (onNavigate) onNavigate('products');
                                }}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
                                    />
                                </div>
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-price">₹{parseFloat(item.price).toLocaleString('en-IN')}</p>

                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="qty-btn"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="qty-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                    title="Remove item"
                                >
                                    &times;
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-subtotal">
                            <span>Subtotal</span>
                            <span className="amount">₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <p className="shipping-note">Shipping & taxes calculated at checkout</p>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
