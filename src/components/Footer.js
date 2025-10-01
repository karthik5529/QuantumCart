import React from 'react';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>About QuantumCart</h4>
                    <p>QuantumCart is your one-stop shop for the latest and greatest in tech, fashion, and home goods. We're committed to providing the best products with exceptional customer service.</p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#">Top Offers</a></li>
                        <li><a href="#">Mobiles</a></li>
                        <li><a href="#">Electronics</a></li>
                        <li><a href="#">Fashion</a></li>
                        <li><a href="#">Home</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Help & Support</h4>
                    <ul>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Shipping Information</a></li>
                        <li><a href="#">Return Policy</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="#" className="social-icon facebook">FB</a>
                        <a href="#" className="social-icon twitter">TW</a>
                        <a href="#" className="social-icon instagram">IG</a>
                    </div>
                    <div className="contact-info">
                        <p><strong>Email:</strong> support@webprime.top</p>
                        <p><strong>Phone:</strong> +91-63802-30778</p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
<p>
  &copy; {new Date().getFullYear()} QuantumCart. All Rights Reserved. Designed with ❤️ by{' '}
  <a href="https://webprime.top" target="_blank" rel="noopener noreferrer" style={{color:"white",textDecoration:"none"}}>webprime</a>.
</p>            </div>
        </footer>
    );
};

export default Footer;
