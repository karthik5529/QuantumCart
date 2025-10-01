// server.js - The complete backend for the e-commerce app
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware Setup ---
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session expires after 24 hours
}));
app.use(passport.initialize());
app.use(passport.session());

// --- MongoDB Connection & Schemas ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    joinedDate: { type: Date, default: Date.now },
    membership: { type: String, enum: ['Normal', 'Gold'], default: 'Normal' },
    totalSpent: { type: Number, default: 0 },
    cart: [{
        productId: Number,
        name: String,
        price: Number,
        image: String,
        quantity: Number,
    }]
});
const User = mongoose.model('User', userSchema);

// --- Mock Product Data ---
const PRODUCTS = [
    { id: 1, name: "QuantumBook Pro Laptop", price: 1299.99, image: "https://placehold.co/600x400/5E35B1/white?text=QuantumBook", rating: 4.8, category: "Electronics", flashSale: true, goldDiscount: true },
    { id: 2, name: "AuraSound Headphones", price: 199.99, image: "https://placehold.co/600x400/3949AB/white?text=AuraSound", rating: 4.6, category: "Electronics", flashSale: false, goldDiscount: false },
    { id: 3, name: "ErgoFlow Mechanical Keyboard", price: 159.50, image: "https://placehold.co/600x400/4776E6/white?text=ErgoFlow", rating: 4.9, category: "Peripherals", flashSale: false, goldDiscount: true },
    { id: 4, name: "NovaStream 4K Webcam", price: 89.99, image: "https://placehold.co/600x400/8E54E9/white?text=NovaStream", rating: 4.5, category: "Peripherals", flashSale: true, goldDiscount: false },
    { id: 5, name: "GamerShift Pro Chair", price: 349.99, image: "https://placehold.co/600x400/5E35B1/white?text=GamerShift", rating: 4.7, category: "Furniture", flashSale: false, goldDiscount: true },
    { id: 6, name: "Zenith Ultrawide Monitor", price: 799.00, image: "https://placehold.co/600x400/3949AB/white?text=Zenith", rating: 4.8, category: "Electronics", flashSale: false, goldDiscount: true }
];

// --- Passport.js Google OAuth20 Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user); // User found, log them in
        } else {
            // If user not found, create a new user in the database
            const newUser = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value,
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// --- API Endpoints ---
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).json({ message: "Not authenticated" });
};

// Auth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
    (req, res) => res.redirect('http://localhost:3000')
);
app.get('/api/me', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

// Correct, single logout route with added debugging
app.get('/api/logout', (req, res, next) => {
    console.log('--- LOGOUT ROUTE HIT ---');
    console.log('User on session before logout:', req.user ? req.user.displayName : 'No user in session');
    
    req.logout(function(err) {
        if (err) {
            console.error('Error from req.logout():', err);
            return next(err);
        }
        console.log('Callback from req.logout() executed successfully.');

        req.session.destroy((err) => {
            if (err) {
                console.error("Error from req.session.destroy():", err);
                return next(err);
            }
            console.log('Session destroyed successfully.');
            res.clearCookie('connect.sid'); // The default session cookie name
            console.log('Session cookie cleared. Sending success response.');
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});

// Product route
app.get("/api/products", (req, res) => res.json(PRODUCTS));

// Cart route
app.post('/api/cart', ensureAuthenticated, async (req, res) => {
    const { product } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const cartItemIndex = user.cart.findIndex(item => item.productId === product.id);

        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity += 1;
        } else {
            user.cart.push({
                productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1
            });
        }
        await user.save();
        res.status(200).json(user.cart);
    } catch (err) {
        res.status(500).json({ message: "Error adding item to cart", error: err });
    }
});

// --- Serve React App for Production ---
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Express server running on http://localhost:${PORT}`));

