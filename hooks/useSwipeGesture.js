import { useEffect, useState } from 'react';

/**
 * Custom hook to detect swipe gestures on touch devices
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Minimum distance in pixels to trigger swipe (default: 50)
 * @param {number} options.edgeThreshold - Maximum distance from edge to start swipe (default: 30)
 * @returns {Object} - Object containing swipe state and handlers
 */
export default function useSwipeGesture({ threshold = 50, edgeThreshold = 30 } = {}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // Reset swipe direction after it's been consumed
  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => {
        setSwipeDirection(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    const touchX = e.targetTouches[0].clientX;
    setTouchStart(touchX);
  };

  const onTouchMove = (e) => {
    const touchX = e.targetTouches[0].clientX;
    setTouchEnd(touchX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchEnd - touchStart;
    const isLeftEdgeStart = touchStart < edgeThreshold;
    const isRightEdgeStart = touchStart > window.innerWidth - edgeThreshold;
    
    // Left to right swipe (open sidebar)
    if (distance > threshold && isLeftEdgeStart) {
      setSwipeDirection('right');
    }
    
    // Right to left swipe (close sidebar)
    if (distance < -threshold && isRightEdgeStart) {
      setSwipeDirection('left');
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    swipeDirection,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  };
}
