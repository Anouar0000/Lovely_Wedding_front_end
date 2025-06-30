import { useState, useLayoutEffect } from 'react';

const INVITATION_ASPECT_RATIO = 1 / 1.414;
const MIN_CANVAS_WIDTH = 320;

export const useCanvasLayout = ({ headerRef, mainMenuRef }) => {
  const [canvasStyle, setCanvasStyle] = useState({ width: '100%', height: '100%' });
  const [mainPadding, setMainPadding] = useState({ top: 0, bottom: 0 });

  useLayoutEffect(() => {
    const calculateAndSetLayout = () => {
      const topOffset = headerRef.current ? headerRef.current.offsetHeight : 0;
      const bottomOffset = mainMenuRef.current ? mainMenuRef.current.offsetHeight : 0;
      const topPaddingValue = topOffset + 5;
      const bottomPaddingValue = bottomOffset + 64;
      setMainPadding({ top: topPaddingValue, bottom: bottomPaddingValue });

      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - topPaddingValue - bottomPaddingValue;
      const widthIfLimitedByHeight = availableHeight * INVITATION_ASPECT_RATIO;
      let fitWidth = (widthIfLimitedByHeight < availableWidth) ? widthIfLimitedByHeight : availableWidth;
      const finalWidth = Math.max(fitWidth, MIN_CANVAS_WIDTH);
      const finalHeight = finalWidth / INVITATION_ASPECT_RATIO;
      setCanvasStyle({ width: `${finalWidth}px`, height: `${finalHeight}px` });
    };

    calculateAndSetLayout();
    window.addEventListener('resize', calculateAndSetLayout);
    return () => window.removeEventListener('resize', calculateAndSetLayout);
  }, [headerRef, mainMenuRef]);

  return { canvasStyle, mainPadding };
};