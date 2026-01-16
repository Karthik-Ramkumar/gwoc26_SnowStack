import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Products.css";
import "./Workshops.css";
import ProductList from "./ProductList";
import CustomOrderForm from "./CustomOrderForm";
import ProductCare from "./ProductCare";

const API_BASE_URL = "/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          category: category !== "all" ? category : undefined,
          sort: sortBy,
          page: page,
          page_size: itemsPerPage
        };

        const response = await axios.get(`${API_BASE_URL}/products/products/`, {
          params,
        });

        // Handle both paginated and non-paginated responses
        if (response.data.results) {
          setProducts(response.data.results);
          // Calculate total pages if count is available
          if (response.data.count) {
            setTotalPages(Math.ceil(response.data.count / itemsPerPage));
          }
        } else {
          setProducts(response.data);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy, page, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top of products grid
      const productsGrid = document.querySelector('.products-main');
      if (productsGrid) {
        productsGrid.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const ProductDetails = ({ product, onClose }) => {
    return (
      <div className="workshop-modal-overlay" onClick={onClose}>
        <div className="workshop-modal product-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <div className="modal-content">
            <div className="modal-image">
              {product.image_url_full || product.image ? (
                <img src={product.image_url_full || product.image} alt={product.name} />
              ) : (
                <div className="workshop-placeholder-large">
                  <span className="workshop-icon">🏺</span>
                </div>
              )}
            </div>
            <div className="modal-info">
              <h2>{product.name}</h2>
              <p className="modal-type">{product.category}</p>

              {/* Product Tags - between category and price */}
              {product.tags && product.tags.length > 0 && (
                <div className="product-tags-modal">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="modal-tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="modal-price">₹{parseFloat(product.price).toLocaleString('en-IN')}</div>

              <p className="modal-description">{product.description}</p>

              <div className="modal-details-grid">
                {product.material && (
                  <div className="detail-item">
                    <strong>Material:</strong> {product.material}
                  </div>
                )}
                {product.dimensions && (
                  <div className="detail-item">
                    <strong>Dimensions:</strong> {product.dimensions}
                  </div>
                )}
                {product.weight && (
                  <div className="detail-item">
                    <strong>Weight:</strong> {product.weight} kg
                  </div>
                )}
              </div>

              {product.usage_instructions && (
                <div className="modal-features">
                  <h3>Usage:</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{product.usage_instructions}</p>
                </div>
              )}

              {product.care_instructions && (
                <div className="modal-features">
                  <h3>Care Instructions:</h3>
                  <p style={{ whiteSpace: 'pre-line' }}>{product.care_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="products-page">
      {/* HEADER - 1/3 screen with pattern and Japanese text */}
      <header className="workshops-header" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url('/static/images/gallery/CollectionHeaderbg.png')" }}>
        <h1 className="funnel-title">
          <span className="japanese-accent">陶器</span>
          Collections
        </h1>
        <p>Handcrafted Pottery for Mindful Living</p>
      </header>

      {/* Products Section with Background */}
      <section className="products-main">
        {/* Kiln Energy Background */}
        <div className="products-background">
          <div className="caramel-overlay"></div>
        </div>

        {/* Pottery Shape Decorations */}
        <svg className="pottery-deco pottery-deco-1" viewBox="0 0 80 100" fill="none">
          <path d="M25 15 L55 15 Q65 15, 65 25 L65 75 Q65 90, 50 95 L30 95 Q15 90, 15 75 L15 25 Q15 15, 25 15"
            stroke="currentColor" strokeWidth="2.5" fill="none" />
        </svg>
        <svg className="pottery-deco pottery-deco-2" viewBox="0 0 100 120" fill="none">
          <ellipse cx="50" cy="60" rx="35" ry="45" stroke="currentColor" strokeWidth="2" fill="none" />
          <ellipse cx="50" cy="25" rx="25" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <svg className="pottery-deco pottery-deco-3" viewBox="0 0 90 110" fill="none">
          <path d="M30 20 Q20 25, 20 35 L20 85 Q20 100, 35 105 L55 105 Q70 100, 70 85 L70 35 Q70 25, 60 20 L30 20"
            stroke="currentColor" strokeWidth="2.5" fill="none" />
        </svg>
        <svg className="pottery-deco pottery-deco-4" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M50 15 L50 85" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <svg className="pottery-deco pottery-deco-5" viewBox="0 0 100 130" fill="none">
          <path d="M40 15 L60 15 L65 25 L65 100 Q65 115, 50 120 Q35 115, 35 100 L35 25 L40 15"
            stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <svg className="pottery-deco pottery-deco-6" viewBox="0 0 110 100" fill="none">
          <ellipse cx="55" cy="50" rx="40" ry="35" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <path d="M15 50 Q15 40, 25 35 M95 50 Q95 40, 85 35" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg className="pottery-deco pottery-deco-7" viewBox="0 0 80 120" fill="none">
          <path d="M25 20 Q15 30, 20 50 L25 90 Q30 110, 40 115 Q50 110, 55 90 L60 50 Q65 30, 55 20 L25 20"
            stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <svg className="pottery-deco pottery-deco-8" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Content Container */}
        <div className="products-content">
          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-container">
              <div className="filter-group">
                <label>Category</label>
                <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                  <option value="all">All Collections</option>
                  <option value="tableware">Tableware</option>
                  <option value="art">Art Pieces</option>
                  <option value="custom">Custom Orders</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Sort by</label>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Show</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <ProductList products={products} loading={loading} onProductClick={handleProductClick} />

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft size={20} />
              </button>

              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>



      {/* ========== PORCELAIN QUOTE SECTION ========== */}
      <section className="porcelain-section">
        {/* Abstract Glaze Pour Texture Background */}
        <div className="glaze-texture"></div>

        {/* Porcelain Quote Card */}
        <div className="porcelain-card">
          {/* Philosophy Header */}
          <span className="porcelain-label">OUR PHILOSOPHY</span>

          {/* Quote Text */}
          <p className="porcelain-quote">
            Explore our curated collections of handcrafted pottery, where each piece embodies the philosophy of <strong className="porcelain-keyword">wabi-sabi</strong> — finding beauty in imperfection and celebrating the natural character of clay. From functional everyday items to decorative statement pieces, our collections bring <strong className="porcelain-keyword">mindful artistry</strong> into your space.
          </p>
        </div>
      </section>

      {/* Custom Order Form */}
      <CustomOrderForm />

      {/* Product Care */}
      <ProductCare />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

export default Products;
