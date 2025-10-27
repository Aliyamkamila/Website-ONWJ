import React, { useRef, useEffect, useState } from 'react';
import './logoloop.css';

const LogoLoop = ({
  logos,
  speed = 30,
  direction = 'left',
  logoHeight = 80,
  gap = 40,
  pauseOnHover = true,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = '#ffffff',
  ariaLabel,
}) => {
  const [duplicateCount, setDuplicateCount] = useState(2);
  const trackRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      // Hitung berapa banyak set logo yang dibutuhkan untuk mengisi container
      const container = trackRef.current.parentElement;
      const logoSetWidth = trackRef.current.firstChild.offsetWidth;
      const containerWidth = container.offsetWidth;
      const setsNeeded = Math.ceil((containerWidth * 2) / logoSetWidth);
      setDuplicateCount(Math.max(2, setsNeeded));
    }
  }, [logos]);

  const containerStyle = {
    '--speed': `${speed}s`,
    '--gap': `${gap}px`,
    '--logo-height': `${logoHeight}px`,
    '--direction': direction === 'left' ? 'normal' : 'reverse',
  };

  const gradientStyle = {
    background: `linear-gradient(to right, ${fadeOutColor} 0%, transparent 10%, transparent 90%, ${fadeOutColor} 100%)`,
  };

  return (
    <div className="logo-loop-container">
      {fadeOut && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={gradientStyle}
        />
      )}
      
      <div className="logo-track" ref={trackRef} style={containerStyle}>
        {Array.from({ length: duplicateCount }).map((_, setIndex) => (
          <div key={setIndex} className="logo-content">
            {logos.map((logo, index) => (
              <a
                key={`${setIndex}-${index}`}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`logo-item ${scaleOnHover ? 'hover:scale-110' : ''}`}
                title={logo.title}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoLoop;