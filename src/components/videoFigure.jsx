// src/components/videoFigure.jsx

import React, { useEffect, useState } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default function VideoFigure({ videoSrc, alt, caption, autoPlay = false }) {
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  const parseCaption = (text) => {
    return text.split('\\n').map((line, index, array) => {
      const parsedLine = line.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, (match, linkText, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      });
      return (
        <React.Fragment key={index}>
          <span dangerouslySetInnerHTML={{ __html: parsedLine }} />
          {index < array.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const captionContent = parseCaption(caption);

  useEffect(() => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      setVideoSize({ width: video.videoWidth, height: video.videoHeight });
    };
    video.src = videoSrc;

    const lightbox = new PhotoSwipeLightbox({
      gallery: '#figure-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    const captionLinks = document.querySelectorAll('#figure-gallery figcaption a');
    captionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });

    return () => {
      lightbox.destroy();
      captionLinks.forEach(link => {
        link.removeEventListener('click', (e) => {
          e.stopPropagation();
        });
      });
    };
  }, [videoSrc]);

  return (
    <figure style={{
      border: "1px dashed rgba(0, 0, 0, .1)",
      padding: 0,
      margin: 0,
      marginBottom: 20,
      borderRadius: "15px",
      textAlign: "right",
    }} id="figure-gallery">
      <a href={videoSrc} data-pswp-width={videoSize.width} data-pswp-height={videoSize.height}>
        <video
          src={videoSrc}
          alt={alt}
          controls
          muted
          loop
          autoPlay={autoPlay}  // Pass the autoPlay prop to the video element
          style={{ maxWidth: '100%', height: 'auto' }}
        />
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