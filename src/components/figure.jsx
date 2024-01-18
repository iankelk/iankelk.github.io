// src/components/Figure.jsx

import React, { useState } from 'react';

const Figure = ({ image, alt, caption }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const captionContent = caption.split('\\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    display: isFullScreen ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const fullScreenStyles = {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90%',
    zIndex: 1001
  };

  const closeButtonStyles = {
    position: 'absolute',
    top: '50px',
    right: '10px',
    width: '30px', // Width of the close button
    height: '30px', // Height of the close button
    lineHeight: '30px', // Center the text vertically
    textAlign: 'center', // Center the text horizontally
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <div>
      <div style={overlayStyles} onClick={toggleFullScreen}>
        <img
          src={image}
          alt={alt}
          style={fullScreenStyles}
          onClick={(e) => e.stopPropagation()}
        />
        <span style={closeButtonStyles} onClick={toggleFullScreen}>x</span>
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
