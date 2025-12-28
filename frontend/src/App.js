import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Home from "./components/Home";
import Products from "./components/Products";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Workshops from "./components/Workshops";
import Studio from "./components/Studio";
import Corporate from "./components/Corporate";
import Media from "./components/Media";

import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

const API_BASE_URL = "/api";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="App">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <CartDrawer onNavigate={handleNavigate} />

        {currentPage === "home" && <Home onNavigate={handleNavigate} />}

        {currentPage === "products" && (
          <>
            <section className="page-header">
              <div className="container">
                <h1 className="page-title">
                  <span className="japanese-accent">陶器</span>
                  <span className="main-title">Our Collections</span>
                </h1>
                <p className="page-subtitle">
                  Handcrafted pottery for mindful living
                </p>
              </div>
            </section>

            <section className="section-padding">
              <div className="container">
                <div className="filter-bar">
                  <div className="filter-group">
                    <label>Category:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
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

            <ProductList products={products} loading={loading} />
            <div id="custom-order-section">
              <CustomOrderForm />
            </div>
            <ProductCare />
          </>
        )}

        {currentPage === "workshops" && <Workshops />}
        {currentPage === "studio" && <Studio />}
        {currentPage === "corporate" && <Corporate />}
        {currentPage === "media" && <Media />}

        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
