import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProductList from './components/ProductList';
import CustomOrderForm from './components/CustomOrderForm';
import ProductCare from './components/ProductCare';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Workshops from './components/Workshops';

const API_BASE_URL = '/api';

function App() {
  const [currentPage, setCurrentPage] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Fetch products from API
  useEffect(() => {
    if (currentPage === 'products') {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const params = {
            category: category !== 'all' ? category : undefined,
            sort: sortBy,
          };
          
          const response = await axios.get(`${API_BASE_URL}/products/`, { params });
          setProducts(response.data.results || response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
          setLoading(false);
        }
      };
      
      fetchProducts();
    }
  }, [category, sortBy, currentPage]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'products' ? (
        <>
          {/* Page Header */}
          <section className="page-header">
            <div className="container">
              <h1 className="page-title">
                <span className="japanese-accent">陶器</span>
                <span className="main-title">Our Collections</span>
              </h1>
              <p className="page-subtitle">Handcrafted pottery for mindful living</p>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="section-padding" style={{paddingTop: 'var(--spacing-md)'}}>
            <div className="container">
              <div className="filter-bar">
                <div className="filter-group">
                  <label>Category:</label>
                  <select 
                    id="categoryFilter" 
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="all">All Collections</option>
                    <option value="tableware">Tableware</option>
                    <option value="art">Art Pieces</option>
                    <option value="custom">Custom Orders</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Sort by:</label>
                  <select 
                    id="sortFilter"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Products List */}
          <ProductList products={products} loading={loading} />

          {/* Custom Orders Section */}
          <CustomOrderForm />

          {/* Product Care Information */}
          <ProductCare />
        </>
      ) : (
        <Workshops />
      )}

      <Footer />
    </div>
  );
}

export default App;

