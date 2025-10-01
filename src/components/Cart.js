import React, { useState } from 'react';
import PaymentGatewayModal from './PaymentGatewayModal';

// 1. Accept the new 'onRemoveItem' and 'onClearCart' props
const Cart = ({ cart = [], onClose, user, onRemoveItem, onClearCart }) => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleCheckoutClick = (e) => {
        e.stopPropagation();
        setShowPaymentModal(true);
    };
    
    const handleRemoveClick = (e, itemId) => {
        e.stopPropagation();
        onRemoveItem(itemId);
    };

    const handleClearClick = (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove all items from your cart?")) {
            onClearCart();
        }
    };

    return (
        <>
            <div className="header-dropdown cart-dropdown">
                <div className="dropdown-header">
                    <h3>Your Cart</h3>
                    {/* 2. Add a "Clear All" button */}
                    {cart.length > 0 && (
                         <button onClick={handleClearClick} className="cart-clear-btn" style={{marginRight:'40%',fontSize:"medium",fontWeight:"bold"}}>Clear All</button>
                    )}
                    <button onClick={onClose} className="dropdown-close-btn">&times;</button>
                </div>
                <div className="dropdown-body">
                    {cart.length === 0 ? (
                        <div className="empty-message empty-cart">
                            {/* ... empty cart SVG and text ... */}
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cart.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <p className="cart-item-name">{item.name}</p>
                                        <p className="cart-item-price">{item.quantity} x ${item.price.toFixed(2)}</p>
                                    </div>
                                    <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                                    {/* 3. Add a remove button for each item */}
                                    <button onClick={(e) => handleRemoveClick(e, item.id)} className="cart-item-remove-btn">&times;</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="dropdown-footer">
                        <div className="cart-subtotal">
                            <span>Subtotal</span>
                            <strong>${subtotal.toFixed(2)}</strong>
                        </div>
                        <button onClick={handleCheckoutClick} className="checkout-button">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>

            {showPaymentModal && (
                <PaymentGatewayModal
                    user={user}
                    cart={cart}
                    subtotal={subtotal}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}
        </>
    );
};

export default Cart;