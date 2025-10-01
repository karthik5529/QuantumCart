import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './App.css';
import { API_BASE_URL } from './config';
function App() {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndCart = async () => {
            try {
                const [userResponse, cartResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/me`, { credentials: 'include' }),
                    fetch(`${API_BASE_URL}/api/cart`, { credentials: 'include' })
                ]);

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData);
                }
                if (cartResponse.ok) {
                    const cartData = await cartResponse.json();
                    setCart(cartData);
                }
            } catch (error) {
                console.log("User not logged in or API error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserAndCart();
    }, []);

    const handleAddToCart = async (product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id }),
                credentials: 'include',
            });
            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    };

    // NOTE: I'm including the definitions for these functions from our previous discussion
    // so the file is complete and won't cause other errors.
    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId }),
                credentials: 'include',
            });
            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error removing from cart:", error);
            return false;
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error clearing cart:", error);
            return false;
        }
    };

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="App">
            {user ? (
                // THIS IS THE FIX: All props are now correctly placed inside the HomePage tag.
                <HomePage 
                    user={user} 
                    cart={cart} 
                    handleAddToCart={handleAddToCart}
                    handleRemoveFromCart={handleRemoveFromCart}
                    handleClearCart={handleClearCart}
                />
            ) : (
                <LoginPage />
            )}
        </div>
    );
}

export default App;