import React, { useState, useMemo, useEffect } from 'react';

// Star rating component (remains the same)
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<span key={i} className="star filled">★</span>);
        } else if (i - 0.5 <= rating) {
            stars.push(<span key={i} className="star half-filled">★</span>);
        } else {
            stars.push(<span key={i} className="star">☆</span>);
        }
    }
    return <div className="star-rating">{stars}</div>;
};

const ProductCard = ({ product, user, onCardClick, onAddToCart }) => {
    // 1. All hooks are now called unconditionally at the top of the component.
    const [isAdded, setIsAdded] = useState(false);
    const [isWished, setIsWished] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    // --- Countdown Timer Logic ---
    useEffect(() => {
        // The logic inside the hook can still be conditional
        if (!product || !product.flashSale || !product.offerEndDate) return;

        const intervalId = setInterval(() => {
            const now = new Date();
            const endDate = new Date(product.offerEndDate);
            const difference = endDate - now;

            if (difference <= 0) {
                setTimeLeft("Offer Expired");
                clearInterval(intervalId);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            let timeString = "";
            if (days > 0) timeString += `${days}d `;
            timeString += `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            setTimeLeft(timeString);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [product]); // Dependency array updated to product


    // --- Dynamic Pricing and Discount Calculation ---
    const displayPrice = useMemo(() => {
        if (!product) return { current: '0.00', original: null, discount: null };
        
        let currentPrice = product.price;
        let originalPrice = null;
        let discountPercentage = 0;

        if (product.flashSale) {
            originalPrice = product.price;
            discountPercentage = 50;
            currentPrice = product.price * (1 - discountPercentage / 100);
        } else if (product.goldDiscount && user?.membership === 'Gold') {
            originalPrice = product.price;
            discountPercentage = 30;
            currentPrice = product.price * (1 - discountPercentage / 100);
        }

        return {
            current: currentPrice.toFixed(2),
            original: originalPrice ? originalPrice.toFixed(2) : null,
            discount: discountPercentage > 0 ? `Get ${discountPercentage}% off` : null
        };
    }, [product, user]);


    // --- Memoized Estimated Delivery Date ---
    const estimatedDeliveryDate = useMemo(() => {
        if (!product) return '';
        const deliveryDate = new Date();
        const deliveryTime = user?.membership === 'Gold' 
            ? Math.floor(Math.random() * 3) + 1
            : Math.floor(Math.random() * 5) + 3;
            
        deliveryDate.setDate(deliveryDate.getDate() + deliveryTime);
        return deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }, [product, user]); // Dependency array updated to product


    // 2. The conditional return (guard clause) now comes AFTER the hooks.
    if (!product) {
        return null; // This is now safe and correct.
    }

    // --- Event Handlers ---
    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (isAdded) return;
        const success = await onAddToCart(product);
        if (success) {
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } else {
            alert('Could not add item to cart.');
        }
    };

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        setIsWished(!isWished);
    };

    return (
        <div className="product-card" onClick={() => onCardClick(product)}>
            <div className="product-card-badges">
                {displayPrice.discount && <span className="badge discount-badge">{displayPrice.discount}</span>}
            </div>
            <button
                className={`wishlist-button ${isWished ? 'wished' : ''}`}
                onClick={handleWishlistToggle}
                aria-label="Add to wishlist"
            >
                {isWished ? '♥' : '♡'}
            </button>

            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                
                <p className="product-description">{product.description}</p>
                
                <div className="product-rating">
                    <StarRating rating={product.rating} />
                    <span className="review-count">({product.reviews?.length || 0} reviews)</span>
                </div>

                <div className="product-price-container">
                    <span className="product-price">${displayPrice.current}</span>
                    {displayPrice.original && (
                        <span className="original-price">${displayPrice.original}</span>
                    )}
                </div>

                {product.flashSale && timeLeft && (
                    <div className="countdown-timer">
                        <span className="countdown-icon">⏳</span> Offer ends in: <strong>{timeLeft}</strong>
                    </div>
                )}

                <p className="delivery-info">
                    Get it by <span className="delivery-date">{estimatedDeliveryDate}</span>
                </p>
                
                <button
                    className={`add-to-cart-button ${isAdded ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isAdded}
                >
                    {isAdded ? '✓ Added!' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;