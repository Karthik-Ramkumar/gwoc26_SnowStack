import React from 'react';
import './WorkshopCarousel.css';

function WorkshopCarousel({ images = [], title = "Workshop Moments", style }) {
  if (!images || images.length === 0) {
    return null;
  }

  // Duplicate images for seamless infinite loop
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className="workshop-carousel-section"
      style={style}
    >
      {/* Content Wrapper - Z-Index 2 */}
      <div className="workshop-content-wrapper">

        {/* Floating Heading - Outside Card, Top Center */}
        <div className="workshop-floating-header">
          <h2>{title}</h2>
        </div>

        {/* Brown Glass Container - Centered Below Heading */}
        <div className="workshop-glass-card">
          {/* Automatic Infinite Carousel (Marquee) */}
          <div className="workshop-carousel-container">
            <div className="workshop-carousel-track">
              {duplicatedImages.map((image, index) => (
                <div key={`img-${index}`} className="workshop-carousel-item">
                  <img
                    src={image.src || image.image_url}
                    alt={image.alt || image.caption || `Workshop ${index + 1}`}
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

export default WorkshopCarousel;
