import React, { useState } from 'react';
import GoldMembershipModal from './GoldMembershipModal';
import Notifications from './Notifications';
import Cart from './Cart';
import UserProfileModal from './UserProfileModal';
import { API_BASE_URL } from '../config.js'; 

const Header = ({ user, cart, setSearchTerm, handleRemoveFromCart, handleClearCart }) => {
    const [isGoldModalOpen, setGoldModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/logout`, { credentials: 'include' });
            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Logout failed.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <header className="main-header">
                <div className="logo">QuantumCart</div>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search for products, brands, and more"
                        className="search-input"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="search-button">
                        <svg height="20px" width="20px" viewBox="0 0 24 24"><g strokeWidth="2.1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"></path><path d="M21 21L16.65 16.65"></path></g></svg>
                    </button>
                </div>

                <div className="header-actions">
                    {user.membership !== 'Gold' && (
                        <button onClick={() => setGoldModalOpen(true)} className="join-gold-btn">
                            ✨ Join Gold
                        </button>
                    )}
                   <div className="action-icon-container" onClick={() => { setShowNotifications(!showNotifications); setShowCart(false); }}>
                        <svg className="action-icon" viewBox="0 0 24 24"><path d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2M20 17.5V11c0-3.1-2.1-5.6-5-6.5V4c0-.8-.7-1.5-1.5-1.5S12 3.2 12 4v.5C9.1 5.4 7 7.9 7 11v6.5l-2 2v1h14v-1l-2-2z"></path></svg>
                        {/* FIX: Change badge to 1 and make it dynamic */}
                        {user && <span className="action-badge">1</span>}
                        
                        {/* UPDATE: Pass the user prop to the Notifications component */}
                        {showNotifications && <Notifications user={user} onClose={() => setShowNotifications(false)} />}
                    </div>
                    <div className="action-icon-container" onClick={() => { setShowCart(!showCart); setShowNotifications(false); }}>
                        <svg className="action-icon" viewBox="0 0 24 24"><path d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18M7.17,14.75L7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5L19.25,4.5L17.3,8H8.53L8.4,7.71L6,2H4V4H6L9.6,11.59L7.25,12.25L4.27,2H1V4H3L6.6,11.59L5.25,14.03C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42C7.29,15 7.17,14.89 7.17,14.75Z"></path></svg>
                        {cartCount > 0 && <span className="action-badge">{cartCount}</span>}
                        {showCart && (
                            <Cart 
                                cart={cart} 
                                user={user} 
                                onClose={() => setShowCart(false)}
                                onRemoveItem={handleRemoveFromCart}
                                onClearCart={handleClearCart}
                            />
                        )}
                    </div>
                    
                    <div className="user-menu" onClick={() => setProfileModalOpen(true)}>
                        <img src={user.image} alt={user.displayName} className="user-avatar" />
                    </div>
                </div>
                
                <button className="hamburger-menu" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                    <svg className="hamburger-icon" viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path></svg>
                </button>
            </header>

            {isMobileMenuOpen && (
                <div className="mobile-nav-menu">
                    {user.membership !== 'Gold' && (
                        <button onClick={() => { setGoldModalOpen(true); setMobileMenuOpen(false); }} className="join-gold-btn-mobile">
                            ✨ Join Gold
                        </button>
                    )}
                    <a href="#" onClick={() => { setProfileModalOpen(true); setMobileMenuOpen(false); }}>My Profile</a>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}

            {isGoldModalOpen && <GoldMembershipModal onClose={() => setGoldModalOpen(false)} />}
            
            {/* THIS IS THE KEY CHANGE: Pass the handleLogout function as a prop */}
            {isProfileModalOpen && (
                <UserProfileModal 
                    user={user} 
                    onClose={() => setProfileModalOpen(false)}
                    handleLogout={handleLogout}
                />
            )}
            
        </>
    );
};

export default Header;
