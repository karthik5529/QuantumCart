import React, { useState, useEffect } from 'react';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2670',
        title: 'Grand Festive Sale',
        subtitle: 'Up to 80% Off Everything!',
    },
    {
        image: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d54?q=80&w=2670',
        title: 'New Smartphone Arrivals',
        subtitle: 'Get the Latest Tech in Your Hands.',
    },
    {
        image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?q=80&w=2670',
        title: 'Upgrade Your Home',
        subtitle: 'Deals on Furniture & Decor.',
    },
];

const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="carousel-container">
            <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div className="carousel-slide" key={index}>
                        <img src={slide.image} alt={slide.title} />
                        <div className="carousel-caption">
                            <h2>{slide.title}</h2>
                            <p>{slide.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="carousel-button prev" onClick={prevSlide}>&#10094;</button>
            <button className="carousel-button next" onClick={nextSlide}>&#10095;</button>
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <span 
                        key={index} 
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
