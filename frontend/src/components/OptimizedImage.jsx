import React, { useState } from 'react';

/**
 * Optimized Image Component
 * - Lazy loads images
 * - Shows placeholder while loading
 * - Handles errors gracefully
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  onLoad,
  placeholder = null,
  sizes = null 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div 
        className={`image-error ${className}`} 
        style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', minHeight: '200px' }}
        role="img"
        aria-label={alt}
      >
        <span style={{ color: '#999', textAlign: 'center' }}>Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && placeholder ? (
        <div className={`image-placeholder ${className}`} style={style}>
          {placeholder}
        </div>
      ) : null}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'loading' : 'loaded'}`}
        style={{ ...style, display: isLoading ? 'none' : 'block' }}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
      />
    </>
  );
};

export default OptimizedImage;
