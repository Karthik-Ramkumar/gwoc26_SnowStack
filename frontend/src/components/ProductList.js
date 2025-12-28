import { useCart } from '../context/CartContext';

const ProductList = ({ products, loading }) => {
  const { addToCart } = useCart();


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
    <section className="section-padding">
      <div className="container">
        <div className="product-grid">
          {products.length > 0 ? (
            <>
              {products.map((product) => (
                <div
                  key={product.id}
                  className="product-card fade-in"
                  data-category={product.category}
                  data-price={product.price}
                >
                  <div className="product-image">
                    <img
                      src={product.image_url_full || product.image || '/images/products/placeholder.jpg'}
                      alt={product.name}
                      className="placeholder-img"
                      onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
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
                        <button
                          className="btn-icon"
                          onClick={() => addToCart(product)}
                          title="Add to Cart"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Custom Order CTA Card */}
              <div className="product-card custom-order-card fade-in">
                <div className="custom-order-content">
                  <div className="custom-order-text">
                    <span className="custom-order-badge">Custom Order</span>
                    <h3 className="custom-order-title">Can't Find What You're Looking For?</h3>
                    <p className="custom-order-subtitle">
                      We create custom pottery pieces tailored to your vision. From personalized gifts to unique home décor.
                    </p>
                  </div>
                  <button
                    className="custom-order-btn"
                    onClick={() => {
                      const customOrderSection = document.getElementById('custom-order-section');
                      if (customOrderSection) {
                        customOrderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Request Custom Order →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: 'var(--spacing-xl)' }}>
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
