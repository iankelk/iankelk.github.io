// src/components/figure.jsx

import React, { useState, useEffect } from 'react';

const Figure = ({ image, alt, caption }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check and set whether the screen is mobile-sized
    const checkMobileSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initially and on every window resize
    checkMobileSize();
    window.addEventListener('resize', checkMobileSize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', checkMobileSize);
  }, []);

  const captionContent = caption.split('\\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  const toggleFullScreen = () => {
    setIsAnimating(true);
    setIsFullScreen(!isFullScreen);
  };

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: isFullScreen ? 1 : 0,
    visibility: isFullScreen ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease'
  };

  const fullScreenStyles = {
    position: 'fixed',
    maxWidth: isFullScreen ? (isMobile ? '100%' : '90%') : 'auto',
    maxHeight: isFullScreen ? (isMobile ? '100%' : '90%') : 'auto',
    zIndex: 1001,
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    transform: isFullScreen ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.5)',
    left: '50%',
    top: '50%',
    transformOrigin: 'center'
  };

  const closeButtonStyles = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '30px',
    height: '30px',
    lineHeight: '30px',
    textAlign: 'center',
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
    zIndex: 1002
  };

  const handleTransitionEnd = () => {
    if (!isFullScreen) {
      setIsAnimating(false);
    }
  };

  return (
    <div>
      <div style={overlayStyles} onClick={toggleFullScreen}>
        <img
          src={image}
          alt={alt}
          style={fullScreenStyles}
          onClick={(e) => e.stopPropagation()}
          onTransitionEnd={handleTransitionEnd}
        />
        {isAnimating && (
          <span style={closeButtonStyles} onClick={toggleFullScreen}>×</span>
        )}
      </div>
      <figure
        style={{
          border: '1px dashed rgba(0, 0, 0, .1)',
          padding: 0,
          margin: 0,
          marginBottom: 20,
          borderRadius: '15px',
          textAlign: 'right',
        }}
        onClick={toggleFullScreen}
      >
        <img src={image} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
        <hr style={{ margin: '5px 0', backgroundColor: 'rgba(0, 0, 0, .2)' }} />
        <figcaption
          style={{
            marginTop: '0.5em',
            marginBottom: '0.5em',
            marginRight: '1em',
            textAlign: 'right',
            fontSize: '0.8em',
          }}
        >
          {captionContent}
        </figcaption>
      </figure>
    </div>
  );
};

export default Figure;