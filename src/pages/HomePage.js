import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Chatbot from '../components/Chatbot';
import ProductDetailModal from '../components/ProductDetailModal';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

// 1. Update the component to accept cart and handleAddToCart props
const HomePage = ({ user, cart, handleAddToCart, handleRemoveFromCart, handleClearCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [activeSale, setActiveSale] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- Time-Based Sale Logic (remains the same) ---
  useEffect(() => {
    const determineActiveSale = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const month = now.getMonth();

      // Indian Festival Season (September/October for Navaratri/Diwali)
      if (month === 8 || month === 9) { // Sept/Oct
        setActiveSale({
          title: "Grand Festive Sale",
          description: "Biggest deals of the year on all your favorites!",
          theme: "festive"
        });
        return;
      }
      
      // Midnight Madness Sale (11 PM to 2 AM)
      if (hour >= 23 || hour < 2) {
        setActiveSale({
          title: "Midnight Madness",
          description: "Up to 70% off! Deals disappear at sunrise.",
          theme: "midnight"
        });
        return;
      }

      // Weekend Sale (Friday, Saturday, Sunday)
      if (day === 0 || day === 5 || day === 6) {
        setActiveSale({
          title: "Weekend Bonanza",
          description: "Exclusive offers to make your weekend special.",
          theme: "weekend"
        });
        return;
      }
      
      // Weekday Deals (Monday to Thursday)
      setActiveSale({
        title: "Weekday Deals",
        description: "Special prices to brighten up your week.",
        theme: "weekday"
      });
    };
    determineActiveSale();
  }, []);

  // --- Fetch and Filter Products (remains the same) ---
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (sortBy) params.append('sort_by', sortBy);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [searchTerm, sortBy]);

  // Memoized filtering (remains the same)
  const { flashSaleProducts, topDealsProducts } = useMemo(() => {
    const flashSaleItems = products.filter(p => p.flashSale);
    const topDealItems = products.filter(p => !p.flashSale).slice(0, 8);
    return { flashSaleProducts: flashSaleItems, topDealsProducts: topDealItems };
  }, [products]);

  return (
    <div>
      {/* 2. Pass the cart prop to the Header */}
<Header 
    user={user} 
    cart={cart} 
    setSearchTerm={setSearchTerm} 
    handleRemoveFromCart={handleRemoveFromCart}
    handleClearCart={handleClearCart}
/>      <main className="main-content">
        
        {/* --- Dynamic Sale Banner (remains the same) --- */}
        {activeSale && (
          <div className={`sale-banner-container ${activeSale.theme}`}>
            <div className="sale-banner-content">
              <h2>{activeSale.title}</h2>
              <p>{activeSale.description}</p>
            </div>
          </div>
        )}

        {/* --- Flash Sale Section --- */}
        {flashSaleProducts.length > 0 && (
          <section className="product-section">
            <h2 className="section-title">⚡ Flash Sales</h2>
            <div className="product-grid">
              {flashSaleProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  user={user} 
                  onCardClick={setSelectedProduct}
                  onAddToCart={handleAddToCart} // 3. Pass the handler to each ProductCard
                />
              ))}
            </div>
          </section>
        )}

        {/* --- Top Deals Section --- */}
        {topDealsProducts.length > 0 && (
          <section className="product-section">
            <h2 className="section-title">🏆 Today's Top Deals</h2>
            <div className="toolbar">
              <div className="product-count">{products.length} Total Items</div>
              <div className="sort-options">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Customer Rating</option>
                </select>
              </div>
            </div>
            <div className="product-grid">
              {topDealsProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  user={user} 
                  onCardClick={setSelectedProduct}
                  onAddToCart={handleAddToCart} // 3. And also pass it here
                />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Chatbot />

      <ProductDetailModal 
        product={selectedProduct} 
        user={user} 
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart} // 4. Pass the handler to the detail modal as well
      />
      
      <Footer />
    </div>
  );
};

export default HomePage;

