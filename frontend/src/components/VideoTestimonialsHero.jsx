import React, { useState, useMemo } from 'react';
import './VideoTestimonialsHero.css';

export default function VideoTestimonialsHero({ videos = [], onPlay }) {
  const [index, setIndex] = useState(0);

  const len = videos.length;
  const current = len ? videos[index % len] : null;

  const currentThumb = useMemo(() => {
    if (!current) return null;
    return current.thumbnail_url || '/static/images/gallery/vdbg.png';
  }, [current]);

  if (!len) return null;

  return (
    <section
      className="video-hero-section"
      style={{
        backgroundImage: `url(/static/images/gallery/vdbg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Left name bars */}
      <div className="video-hero-side left">
        <div className="name-bar">
          <span className="name-text">{videos[(index - 2 + len) % len]?.customer_name || ''}</span>
        </div>
        <div className="name-bar">
          <span className="name-text">{videos[(index - 1 + len) % len]?.customer_name || ''}</span>
        </div>
        <button className="side-arrow" aria-label="Previous" onClick={() => setIndex((i) => (i - 1 + len) % len)}>←</button>
      </div>

      {/* Center featured card */}
      <div className="video-hero-center">
        <div className="center-card" style={{ backgroundImage: currentThumb ? `url(${currentThumb})` : undefined }}>
          <button
            className="play-button"
            aria-label="Play video"
            onClick={() => onPlay && onPlay(current)}
          >
            ▶
          </button>
          <div className="center-info">
            <div className="name">{current.customer_name}</div>
            {(current.location || current.description) && (
              <div className="role">{current.location || current.description}</div>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Arrows - Below Video */}
        <div className="video-mobile-nav">
          <button 
            className="mobile-nav-arrow prev" 
            aria-label="Previous review" 
            onClick={() => setIndex((i) => (i - 1 + len) % len)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className="video-nav-dots">
            {videos.map((_, i) => (
              <span 
                key={i} 
                className={`nav-dot ${i === index ? 'active' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button 
            className="mobile-nav-arrow next" 
            aria-label="Next review" 
            onClick={() => setIndex((i) => (i + 1) % len)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* Right name bars */}
      <div className="video-hero-side right">
        <div className="name-bar">
          <span className="name-text">{videos[(index + 1) % len]?.customer_name || ''}</span>
        </div>
        <div className="name-bar">
          <span className="name-text">{videos[(index + 2) % len]?.customer_name || ''}</span>
        </div>
        <button className="side-arrow" aria-label="Next" onClick={() => setIndex((i) => (i + 1) % len)}>→</button>
      </div>
    </section>
  );
}
