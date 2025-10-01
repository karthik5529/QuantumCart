import React from 'react';
import ProductCard from './ProductCard';

const ProductRow = ({ title, products, user, onCardClick }) => {
    if (!products || products.length === 0) {
        return null; // Don't render the section if there are no products
    }

    return (
        <section className="product-row-section">
            <div className="product-row-header">
                <h2 className="section-title">{title}</h2>
                {/* The simple "View All" link is kept for accessibility and header consistency */}
                <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="product-row-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        user={user}
                        onCardClick={onCardClick}
                    />
                ))}
                {/* --- NEW: Added a visual "View All" card at the end of the scroll --- */}
                <div className="view-all-card">
                    <div className="view-all-button-container">
                        <a href="#" className="view-all-circle-btn">
                            View All
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductRow;

