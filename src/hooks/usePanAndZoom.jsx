import { useState, useEffect, useRef } from 'react';

const zoomConfig = { zoomOriginOffset: { x: -200, y: -400 } };

export const usePanAndZoom = ({ wrapperRef, isChildInteracting }) => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  useEffect(() => {
    scaleRef.current = scale;
    translateRef.current = translate;
  }, [scale, translate]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const getDistance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    const getMidpoint = (touches) => ({ x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 });
    
    let initialScale = 1;
    let initialTranslate = { x: 0, y: 0 };
    const lastTouch = { current: { x: 0, y: 0 } };
    const initialPinchDistance = { current: 0 };

    const handleTouchStart = (e) => {
      if (isChildInteracting.current) return;
      setIsInteracting(true);
      if (e.touches.length === 1) {
        lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        initialPinchDistance.current = getDistance(e.touches);
        initialScale = scaleRef.current;
        initialTranslate = translateRef.current;
      }
    };

    const handleTouchMove = (e) => {
      if (isChildInteracting.current) return;
      e.preventDefault();
      if (e.touches.length === 2 && initialPinchDistance.current > 0) {
        const newPinchDistance = getDistance(e.touches);
        const scaleDelta = newPinchDistance / initialPinchDistance.current;
        const newScale = Math.min(Math.max(initialScale * scaleDelta, 0.8), 4);
        const midpoint = getMidpoint(e.touches);
        const rect = wrapper.getBoundingClientRect();
        const fingerPosInElement = { x: (midpoint.x - rect.left) + zoomConfig.zoomOriginOffset.x, y: (midpoint.y - rect.top) + zoomConfig.zoomOriginOffset.y };
        const newTranslate = {
          x: fingerPosInElement.x - (fingerPosInElement.x - initialTranslate.x) * (newScale / initialScale),
          y: fingerPosInElement.y - (fingerPosInElement.y - initialTranslate.y) * (newScale / initialScale),
        };
        setScale(newScale);
        setTranslate(newTranslate);
      } else if (e.touches.length === 1) {
        if (scaleRef.current <= 1) return;
        const { clientX, clientY } = e.touches[0];
        const dx = clientX - lastTouch.current.x;
        const dy = clientY - lastTouch.current.y;
        setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastTouch.current = { x: clientX, y: clientY };
      }
    };

    const handleTouchEnd = () => {
      if (isChildInteracting.current) return;
      setIsInteracting(false);
      initialPinchDistance.current = 0;
      const currentScale = scaleRef.current;
      if (currentScale < 1) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;
        const maxPan = { x: (wrapperWidth * currentScale - wrapperWidth) / 2, y: (wrapperHeight * currentScale - wrapperHeight) / 2 };
        setTranslate((prev) => ({
          x: Math.max(-maxPan.x, Math.min(prev.x, maxPan.x)),
          y: Math.max(-maxPan.y, Math.min(prev.y, maxPan.y)),
        }));
      }
    };

    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd);
    wrapper.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [wrapperRef, isChildInteracting]);

  return { scale, translate, isInteracting };
};