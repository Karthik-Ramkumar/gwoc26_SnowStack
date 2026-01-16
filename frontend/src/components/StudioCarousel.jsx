import React from 'react';
import './StudioCarousel.css';

function StudioCarousel({ images = [], title = "Studio & Events", style }) {
  if (!images || images.length === 0) {
    return null;
  }

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className="studio-carousel-section"
      style={style}
    >
      {/* Content Wrapper - Z-Index 2, Absolute Centered */}
      <div className="studio-content-wrapper">

        {/* Floating Heading - Outside Card, Top Center */}
        <div className="studio-floating-header">
          <h2>{title}</h2>
        </div>

        {/* Beige Glass Container - Centered Below Heading */}
        <div className="studio-glass-card">
          {/* Automatic Infinite Carousel (Marquee - Reverse Direction) */}
          <div className="studio-carousel-container">
            <div className="studio-carousel-track">
              {duplicatedImages.map((image, index) => (
                <div key={`img-${index}`} className="studio-carousel-item">
                  <img
                    src={image.src || image.image_url}
                    alt={image.alt || image.caption || `Studio ${index + 1}`}
                    loading="lazy"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default StudioCarousel;
