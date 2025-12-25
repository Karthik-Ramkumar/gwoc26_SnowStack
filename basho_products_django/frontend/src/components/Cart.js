import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('basho_cart') || '[]');
      setCart(savedCart);
    };

    loadCart();

    // Listen for storage changes (in case cart is updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'basho_cart') {
        loadCart();
      }
    };

    // Listen for cart updates from the same tab
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('basho_cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to notify other components of cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('basho_cart', JSON.stringify(updatedCart));
    
    // Dispatch custom event to notify other components of cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('basho_cart');
    
    // Dispatch custom event to notify other components of cart changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  return (
    <div className="cart-container">
      <button
        className="cart-button"
        onClick={() => setIsOpen(!isOpen)}
        title="View Cart"
      >
        🛒
        {getTotalItems() > 0 && (
          <span className="cart-count">{getTotalItems()}</span>
        )}
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Your Cart</h3>
            <button
              className="cart-close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ₹{getTotalPrice().toLocaleString('en-IN')}</strong>
                </div>
                <div className="cart-actions">
                  <button
                    className="btn-secondary"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                  <button className="btn-primary">
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;