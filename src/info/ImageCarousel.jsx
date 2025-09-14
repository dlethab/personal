import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

/**
 * ImageCarousel
 * - Dots for navigation
 * - Swipe support on mobile
 * - If `typing` is true, images “shuffle” automatically; when false, settle on index 0.
 */
export default function ImageCarousel({ images = [], typing }) {
  const [index, setIndex] = useState(0);
  const shuffleTimer = useRef(null);

  useEffect(() => {
    if (typing) {
      shuffleTimer.current && clearInterval(shuffleTimer.current);
      shuffleTimer.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % Math.max(1, images.length));
      }, 840);
    } else {
      shuffleTimer.current && clearInterval(shuffleTimer.current);
      setIndex(0);
    }
    return () => shuffleTimer.current && clearInterval(shuffleTimer.current);
  }, [typing, images.length]);

  const goTo = (i) => setIndex(i);

  // Touch/swipe handlers
  const touchRef = useRef({ x: 0, dx: 0 });
  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, dx: 0 };
  };
  const onTouchMove = (e) => {
    touchRef.current.dx = e.touches[0].clientX - touchRef.current.x;
  };
  const onTouchEnd = () => {
    const { dx } = touchRef.current;
    if (Math.abs(dx) > 40) {
      const dir = dx < 0 ? 1 : -1;
      setIndex((prev) => (prev + dir + images.length) % images.length);
    }
  };

  return (
    <div
      className="carousel"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {images.map((src, i) => (
        <div key={i} className={`slide ${i === index ? "active" : "hidden"}`}>
          {src ? (
            <img src={src} alt={`Slide ${i + 1}`} />
          ) : (
            <div className="empty-note">Add an image for slide {i + 1}</div>
          )}
        </div>
      ))}
      {images.length > 1 && (
        <div className="carousel-dots" role="tablist" aria-label="About me photos">
          {images.map((_, i) => (
            <button
              key={i}
              className="dot"
              role="tab"
              aria-current={index === i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  typing: PropTypes.bool,
};
