import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import './ProductList.css';

// Toast Notification Component
const Toast = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  return (
    <div className={`cart-toast ${isVisible ? 'cart-toast--visible' : ''}`}>
      <div className="cart-toast__icon">
        <Check size={18} strokeWidth={3} />
      </div>
      <span className="cart-toast__message">{message}</span>
    </div>
  );
};

// Add to Cart Button / Quantity Stepper Component
const CartButton = ({ product, onFirstAdd }) => {
  const { addToCart, getItemQuantity, updateQuantity, cart } = useCart();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Check if this is the first add (quantity was 0)
    const wasZero = quantity === 0;

    addToCart({
      id: product.id,
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image,
      image_url_full: product.image_url_full,
      type: 'product'
    });

    // Trigger toast only on first add
    if (wasZero) {
      onFirstAdd(product.name);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image: product.image,
      image_url_full: product.image_url_full,
      type: 'product'
    });
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    // Find the cart item to get its cartKey
    const cartItem = cart.find(item => item.id === product.id);
    if (cartItem) {
      updateQuantity(cartItem.cartKey, quantity - 1);
    }
  };

  // Render quantity stepper if item is in cart
  if (quantity > 0) {
    return (
      <div className="cart-stepper" onClick={(e) => e.stopPropagation()}>
        <button
          className="cart-stepper__btn cart-stepper__btn--minus"
          onClick={handleDecrement}
          aria-label="Decrease quantity"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>
        <span className="cart-stepper__qty">{quantity}</span>
        <button
          className="cart-stepper__btn cart-stepper__btn--plus"
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Render Add to Cart button
  return (
    <button
      className="add-to-cart-btn"
      onClick={handleAddToCart}
      title="Add to Cart"
    >
      <ShoppingCart size={18} strokeWidth={2.5} />
      <span>Add to Cart</span>
    </button>
  );
};

const ProductList = ({ products, loading, onProductClick }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleFirstAdd = useCallback((productName) => {
    setToastMessage(`${productName} added to cart`);
    setToastVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setToastVisible(false);
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onHide={hideToast}
      />

      <section className="section-padding">
        <div className="container">
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="product-card fade-in"
                  data-category={product.category}
                  data-price={product.price}
                  onClick={() => onProductClick && onProductClick(product)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="product-image">
                    <img
                      src={product.image_url_full || product.image || '/static/images/products/placeholder.svg'}
                      alt={product.name}
                      className="placeholder-img"
                    />
                    {product.is_bestseller && (
                      <span className="product-badge">Bestseller</span>
                    )}
                    {!product.is_bestseller && product.is_featured && (
                      <span className="product-badge">Featured</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-meta">
                      {product.tags && product.tags.map((tag, index) => (
                        <span key={index} className="meta-tag">{tag}</span>
                      ))}
                    </div>
                    <p className="product-description">
                      {product.short_description || product.description}
                    </p>
                    <div className="product-details">
                      <span className="product-price">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                      <div className="product-actions">
                        <CartButton product={product} onFirstAdd={handleFirstAdd} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', padding: 'var(--spacing-xl)' }}>
                No products found in this category.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductList;
