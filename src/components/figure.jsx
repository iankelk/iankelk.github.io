// src/components/figure.jsx

// Captioned image with support for newline "\n" in caption, and PhotoSwipe viewing upon click

import React, { useEffect, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default function Figure({ image, alt, caption }) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const captionContent = caption.split('\\n').map((line, index, array) => (
    <React.Fragment key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </React.Fragment>
  ));

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = image;

    const lightbox = new PhotoSwipeLightbox({
      gallery: '#figure-gallery',
      children: 'a',
      // Load PhotoSwipe upon click on image
      pswpModule: () => import('photoswipe'),
      // Other PhotoSwipe options...
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [image]);

  return (
    <figure style={{
      border: "1px dashed rgba(0, 0, 0, .1)",
      padding: 0,
      margin: 0,
      marginBottom: 20,
      borderRadius: "15px",
      textAlign: "right",
    }} id="figure-gallery">
      <a href={image} data-pswp-width={imageSize.width} data-pswp-height={imageSize.height}>
        <img src={image} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />
      </a>
      <hr style={{ margin: "5px 0", backgroundColor: "rgba(0, 0, 0, .2)" }} />
      <figcaption style={{
        marginTop: "0.5em",
        marginBottom: "0.5em",
        marginRight: "1em",
        textAlign: "right",
        fontSize: "0.8em",
      }}>
        {captionContent}
      </figcaption>
    </figure>
  );
}
