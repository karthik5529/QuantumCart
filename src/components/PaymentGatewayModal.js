import React, { useState } from 'react';

// --- Inline Styles Object (no changes) ---
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
    },
    modal: {
        background: '#fff',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '420px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.3s ease-out',
        // overflow: 'hidden', // FIX: This was preventing scroll, so we remove it.
        // --- ADD THESE TWO LINES ---
        maxHeight: '90vh', // Ensures the modal is never taller than 90% of the screen height
        overflowY: 'auto', // Allows the modal content to scroll vertically if needed
    },
    header: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        position: 'relative',
    },
    headerTitle: {
        margin: '0',
        fontSize: '1.2rem',
    },
    headerAmount: {
        margin: '5px 0 0',
        fontSize: '2rem',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
    body: {
        padding: '25px',
    },
    orderSummary: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid #eee',
    },
    summaryImage: {
        width: '60px',
        height: '60px',
        borderRadius: '6px',
        objectFit: 'cover',
    },
    summaryDetails: {
        flexGrow: 1,
    },
    summaryProductName: {
        margin: '0 0 5px 0',
        fontSize: '1rem',
        fontWeight: '600',
    },
    summaryPrice: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#555',
    },
    paymentOptions: {
        listStyle: 'none',
        padding: 0,
        margin: '0',
    },
    option: {
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    optionIcon: {
        fontSize: '1.5rem',
    },
    payButton: {
        width: '100%',
        padding: '15px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#27ae60',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonDisabled: {
        backgroundColor: '#95a5a6',
        cursor: 'not-allowed',
    },
    spinner: {
        width: '20px',
        height: '20px',
        border: '3px solid rgba(255,255,255,0.3)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '10px',
    },
    footer: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#777',
        borderTop: '1px solid #eee',
    },
    razorpayLogo: {
        fontWeight: 'bold',
        color: '#3498db',
    },
    alertOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3001,
    },
    alertBox: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 5px 25px rgba(0,0,0,0.1)',
        animation: 'fadeIn 0.3s ease-out',
        borderTop: '5px solid #e67e22',
    },
    alertIcon: {
        fontSize: '3rem',
        color: '#e67e22',
    },
    alertTitle: {
        margin: '15px 0 10px',
        fontSize: '1.3rem',
        fontWeight: '600',
    },
    alertMessage: {
        margin: '0 0 25px',
        color: '#555',
        lineHeight: 1.5,
    },
    notifyButton: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#3498db',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    
};

// --- Maintenance Alert Component (no changes) ---
const MaintenanceAlert = ({ onClose }) => {
    const handleNotify = () => {
        alert("Thank you! We will notify you via email once our servers are back online.");
        onClose();
    };

    return (
        <div style={styles.alertOverlay}>
            <div style={styles.alertBox}>
                <div style={styles.alertIcon}>⚠️</div>
                <h3 style={styles.alertTitle}>Server Maintenance</h3>
                <p style={styles.alertMessage}>
                    Payments are temporarily unavailable. We'll send you an email once everything is back to normal.
                </p>
                <button style={styles.notifyButton} onClick={handleNotify}>
                    Notify Me
                </button>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT UPGRADE ---
const PaymentGatewayModal = ({ product, cart, subtotal, user, onClose }) => {
    const [selectedOption, setSelectedOption] = useState('upi');
    const [isLoading, setIsLoading] = useState(false);
    const [showMaintenanceAlert, setShowMaintenanceAlert] = useState(false);

    // 1. DETERMINE MODE: Check if we are in 'cart' mode or 'single product' mode.
    const isCartMode = cart && cart.length > 0;

    // 2. UNIFY DATA: Set the price and display details based on the mode.
    let finalPrice;
    let displayItem;
    let displayName;
    let originalPriceText;

    if (isCartMode) {
        finalPrice = subtotal;
        displayItem = cart[0]; // Use the first item for the summary image
        displayName = `Your Order (${cart.length} items)`;
        originalPriceText = `Total value of all items`;
    } else {
        // Fallback to single product logic (for "Buy Now")
        if (product.flashSale) {
            finalPrice = product.price * 0.5;
        } else if (product.goldDiscount && user?.membership === 'Gold') {
            finalPrice = product.price * 0.7;
        } else {
            finalPrice = product.price;
        }
        displayItem = product;
        displayName = product.name;
        originalPriceText = `Price: $${product.price.toFixed(2)}`;
    }

    const handlePayment = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowMaintenanceAlert(true);
        }, 3000);
    };

    const paymentOptions = [
        { id: 'upi', name: 'UPI / QR', icon: '📱' },
        { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
        { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
        { id: 'wallet', name: 'Mobile Wallets', icon: '💼' },
    ];

    // Guard against rendering if there's no data
    if (!displayItem) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {showMaintenanceAlert && <MaintenanceAlert onClose={onClose} />}

                <div style={styles.header}>
                    <button style={styles.closeButton} onClick={onClose}>×</button>
                    <h2 style={styles.headerTitle}>Complete Your Payment</h2>
                    {/* 3. Use the unified finalPrice variable */}
                    <p style={styles.headerAmount}>${finalPrice.toFixed(2)}</p>
                </div>
                <div style={styles.body}>
                    <div style={styles.orderSummary}>
                        {/* 4. Use the unified displayItem and displayName variables */}
                        <img src={displayItem.image} alt={displayName} style={styles.summaryImage} />
                        <div style={styles.summaryDetails}>
                            <h4 style={styles.summaryProductName}>{displayName}</h4>
                            <p style={styles.summaryPrice}>
                                {originalPriceText}
                            </p>
                        </div>
                    </div>

                    <ul style={styles.paymentOptions}>
                        {paymentOptions.map(opt => (
                            <li 
                                key={opt.id} 
                                style={{
                                    ...styles.option,
                                    backgroundColor: selectedOption === opt.id ? '#e8f4fd' : 'transparent',
                                    borderColor: selectedOption === opt.id ? '#3498db' : '#ddd',
                                }}
                                onClick={() => setSelectedOption(opt.id)}
                            >
                                <span style={styles.optionIcon}>{opt.icon}</span>
                                <span>{opt.name}</span>
                            </li>
                        ))}
                    </ul>
                    <button 
                        style={{...styles.payButton, ...(isLoading ? styles.payButtonDisabled : {})}} 
                        onClick={handlePayment}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div style={styles.spinner}></div>
                                Processing...
                            </>
                        ) : (
                            'Pay Securely'
                        )}
                    </button>
                </div>
                <div style={styles.footer}>
                    <span>Powered by </span>
                    <span style={styles.razorpayLogo}>Razorpay</span>
                </div>
            </div>
            <style>
                {`
                    @keyframes slideUp {
                        from { transform: translateY(30px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

export default PaymentGatewayModal;