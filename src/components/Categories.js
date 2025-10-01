import React from 'react';

const categories = [
    { name: 'Top Offers', icon: '🏷️' },
    { name: 'Mobiles', icon: '📱' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Home', icon: '🏠' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Appliances', icon: '🔌' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Beauty & Toys', icon: '💄' },
];

const Categories = () => {
    return (
        <nav className="category-nav-container">
            <div className="category-nav">
                {categories.map(category => (
                    <a href="#" key={category.name} className="category-item">
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default Categories;
