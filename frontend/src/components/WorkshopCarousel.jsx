import React, { useRef, useState } from 'react';
import './WorkshopCarousel.css';

function WorkshopCarousel({ images = [], title = "Workshop Moments", style }) {
  // Drag scroll state
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Drag scroll handlers for desktop
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = 'grab';
      }
    }
  };

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
          <div 
            className={`workshop-carousel-container ${isDragging ? 'is-dragging' : ''}`}
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
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
