// src/components/figure.jsx

// Captioned image with support for newline "\n" in caption, and PhotoSwipe viewing upon click

import React, { useEffect, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default function Figure({ image, alt, caption }) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const parseCaption = (text) => {
    // Splitting by newline first
    return text.split('\\n').map((line, index, array) => {
      // Parsing Markdown-style links in each line
      const parsedLine = line.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, (match, linkText, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      });
      return (
        <React.Fragment key={index}>
          {/* Using dangerouslySetInnerHTML to render the parsed line as HTML */}
          <span dangerouslySetInnerHTML={{ __html: parsedLine }} />
          {index < array.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const captionContent = parseCaption(caption);

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
    });
    lightbox.init();

    // Adding event listener to caption links to stop propagation
    const captionLinks = document.querySelectorAll('#figure-gallery figcaption a');
    captionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation(); // This prevents PhotoSwipe from handling the click
      });
    });

    return () => {
      lightbox.destroy();
      // Clean up event listeners
      captionLinks.forEach(link => {
        link.removeEventListener('click', (e) => {
          e.stopPropagation();
        });
      });
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
