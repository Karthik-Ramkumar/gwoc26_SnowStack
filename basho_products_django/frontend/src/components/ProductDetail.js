import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = '/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}/`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = (productId, productName, price) => {
    const cart = JSON.parse(localStorage.getItem('basho_cart') || '[]');

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: price,
        quantity: 1
      });
    }

    localStorage.setItem('basho_cart', JSON.stringify(cart));
    
    // Dispatch custom event to notify cart component of changes
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    alert(`${productName} added to cart!`);
  };

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

  if (error) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="error-message">
            <h2>{error}</h2>
            <Link to="/" className="btn-primary">Back to Products</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">
        <div className="product-detail">
          <div className="product-detail-image">
            <img
              src={product.image_url_full || product.image || '/images/products/placeholder.jpg'}
              alt={product.name}
              className="product-detail-img"
            />
          </div>
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-detail-meta">
              {product.tags && product.tags.map((tag, index) => (
                <span key={index} className="meta-tag">{tag}</span>
              ))}
            </div>
            <p className="product-detail-description">{product.description}</p>
            <div className="product-detail-price">
              <span className="price">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
            </div>
            <div className="product-detail-actions">
              <button
                className="btn-primary"
                onClick={() => addToCart(product.product_id, product.name, product.price)}
              >
                Add to Cart
              </button>
              <Link to="/" className="btn-secondary">Back to Products</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;