import React, { useState, useMemo } from 'react';
import PaymentGatewayModal from './PaymentGatewayModal';

// Star rating component (can be shared or defined locally)
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) stars.push(<span key={i} className="star filled">★</span>);
        else if (i - 0.5 <= rating) stars.push(<span key={i} className="star half-filled">★</span>);
        else stars.push(<span key={i} className="star">☆</span>);
    }
    return <div className="star-rating">{stars}</div>;
};

const ProductDetailModal = ({ product, user, onClose, onAddToCart }) => {
    // 1. ALL HOOKS ARE NOW CALLED UNCONDITIONALLY AT THE TOP
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    // --- Base price calculation ---
    const priceDetails = useMemo(() => {
        // Safety check inside the hook
        if (!product) return { current: 0, original: null, discount: 0 };

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
        return { current: currentPrice, original: originalPrice, discount: discountPercentage };
    }, [product, user]);

    // --- Final price calculation ---
    const finalPrice = useMemo(() => {
        let price = priceDetails.current;
        if (selectedOffer && selectedOffer.discount_percent > 0) {
            const discountAmount = price * (selectedOffer.discount_percent / 100);
            price -= discountAmount;
        }
        return price;
    }, [priceDetails, selectedOffer]);

    // 2. THE CONDITIONAL RETURN (GUARD CLAUSE) NOW COMES AFTER ALL HOOKS
    if (!product) {
        return null;
    }

    // --- Delivery Date Calculation ---
    const getDeliveryDate = () => {
        const deliveryDate = new Date();
        const deliveryTime = user?.membership === 'Gold' ? (Math.floor(Math.random() * 2) + 1) : (Math.floor(Math.random() * 4) + 3);
        deliveryDate.setDate(deliveryDate.getDate() + deliveryTime);
        return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    // --- Event Handlers ---
    const handleOfferClick = (offer) => {
        if (selectedOffer && selectedOffer.type === offer.type) {
            setSelectedOffer(null);
        } else {
            setSelectedOffer(offer);
        }
    };

    const handleAddToCart = async () => {
        if (isAdded) return;
        const success = await onAddToCart(product);
        if (success) {
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } else {
            alert("Could not add item to cart.");
        }
    };

    return (
        <>
            <div className="product-detail-modal-overlay" onClick={onClose}>
                <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-button" onClick={onClose}>×</button>
                    
                    <div className="modal-content-grid">
                        <div className="modal-image-gallery">
                            <img src={product.image} alt={product.name} className="modal-main-image" />
                        </div>

                        <div className="modal-product-info">
                            <h2 className="modal-product-name">{product.name}</h2>
                            <div className="modal-product-rating">
                                <StarRating rating={product.rating} />
                                <span>{product.reviews?.length || 0} ratings</span>
                            </div>
                            <hr className="modal-divider" />
                            <div className="modal-price-section">
                                {priceDetails.discount > 0 && (
                                    <span className="modal-discount-tag">-{priceDetails.discount}%</span>
                                )}
                                <span className="modal-current-price">${finalPrice.toFixed(2)}</span>
                                {priceDetails.original && (
                                    <span className="modal-original-price">M.R.P.: ${priceDetails.original.toFixed(2)}</span>
                                )}
                            </div>
                            <p className="modal-inclusive-text">Inclusive of all taxes</p>

                            <div className="coupons-section">
                                <h4>Available Offers</h4>
                                {product.availableOffers && product.availableOffers.map((offer, index) => (
                                    <div 
                                        key={index} 
                                        className={`coupon-item ${selectedOffer?.type === offer.type ? 'selected' : ''}`}
                                        onClick={() => handleOfferClick(offer)}
                                    >
                                        <span className="coupon-icon">{offer.icon}</span>
                                        <div>
                                            <strong>{offer.type}</strong>
                                            <p>{offer.details}</p>
                                        </div>
                                    </div>
                                ))}
                                {user?.membership === 'Gold' && (
                                    <div className="coupon-item gold-offer">
                                        <span className="coupon-icon">✨</span>
                                        <div>
                                            <strong>Gold Member Exclusive</strong>
                                            <p>Extra 30% Off at checkout!</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="delivery-details">
                                <span className="delivery-icon">🚚</span>
                                <div>
                                    <p><strong>FREE delivery</strong> by <strong>{getDeliveryDate()}</strong></p>
                                    <p className="delivery-subtext">Order within the next 8 hours</p>
                                </div>
                            </div>

                            <p className="in-stock-text">In Stock.</p>
                            
                            <button
                                className={`modal-add-to-cart-btn ${isAdded ? 'added' : ''}`}
                                onClick={handleAddToCart}
                                disabled={isAdded}
                            >
                                {isAdded ? '✓ Added!' : 'Add to Cart'}
                            </button>
                            <button className="modal-buy-now-btn" onClick={() => setShowPaymentModal(true)}>Buy Now</button>
                        </div>
                    </div>

                    <div className="customer-reviews-section">
                        <hr className="modal-divider" />
                        <h3>Customer Reviews</h3>
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => (
                                <div key={index} className="review-item">
                                    <div className="review-author">
                                        <span className="review-avatar">{review.author.charAt(0)}</span>
                                        <strong>{review.author}</strong>
                                    </div>
                                    <div className="review-rating">
                                        <StarRating rating={5} />
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet for this product.</p>
                        )}
                    </div>
                </div>
            </div>

            {showPaymentModal && (
                <PaymentGatewayModal 
                    product={product} 
                    user={user} 
                    onClose={() => setShowPaymentModal(false)} 
                />
            )}
        </>
    );
};

export default ProductDetailModal;