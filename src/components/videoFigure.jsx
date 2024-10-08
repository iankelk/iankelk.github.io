// src/components/videoFigure.jsx

import React, { useEffect, useState, useRef } from 'react';

export default function VideoFigure({ videoSrc, alt, caption, autoPlay = false }) {
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

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
    setIsMobile('ontouchstart' in window);
  }, []);

  useEffect(() => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      setVideoSize({ width: video.videoWidth, height: video.videoHeight });
    };
    video.src = videoSrc;
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && autoPlay && !isMobile) {
      video.play().catch(error => console.error("Autoplay failed:", error));
    }
  }, [autoPlay, isMobile]);

  return (
    <figure style={{
      border: "1px dashed rgba(0, 0, 0, .1)",
      padding: 0,
      margin: 0,
      marginBottom: 20,
      borderRadius: "15px",
      textAlign: "right",
    }}>
      <video
        ref={videoRef}
        src={videoSrc}
        alt={alt}
        controls
        loop
        playsInline
        muted={!isMobile}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
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
