import { useState, useLayoutEffect } from 'react';

const DEFAULT_INVITATION_ASPECT_RATIO = 1 / 1.414;
const VIEWPORT_WIDTH_RATIO = 0.94;
const VIEWPORT_HEIGHT_RATIO = 0.98;
const MIN_CANVAS_WIDTH = 240;
const MAX_CANVAS_WIDTH = 500;

export const useCanvasLayout = ({ headerRef, mainMenuRef, aspectRatio = DEFAULT_INVITATION_ASPECT_RATIO }) => {
  const [canvasStyle, setCanvasStyle] = useState({ width: '100%', height: '100%' });
  const [mainPadding, setMainPadding] = useState({ top: 0, bottom: 0 });

  useLayoutEffect(() => {
    const calculateAndSetLayout = () => {
      const resolvedAspectRatio = Number.isFinite(aspectRatio) && aspectRatio > 0
        ? aspectRatio
        : DEFAULT_INVITATION_ASPECT_RATIO;
      const topOffset = headerRef.current ? headerRef.current.offsetHeight : 0;
      const bottomOffset = mainMenuRef.current ? mainMenuRef.current.offsetHeight : 0;
      const topPaddingValue = topOffset + 5;
      const bottomPaddingValue = bottomOffset + 56;
      setMainPadding({ top: topPaddingValue, bottom: bottomPaddingValue });

      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - topPaddingValue - bottomPaddingValue;
      const widthFromViewport = availableWidth * VIEWPORT_WIDTH_RATIO;
      const widthFromHeight = availableHeight * resolvedAspectRatio * VIEWPORT_HEIGHT_RATIO;
      const targetWidth = Math.min(widthFromViewport, widthFromHeight, MAX_CANVAS_WIDTH);
      const minWidth = Math.min(MIN_CANVAS_WIDTH, availableWidth, widthFromHeight);
      const finalWidth = Math.max(targetWidth, minWidth);
      const finalHeight = finalWidth / resolvedAspectRatio;
      setCanvasStyle({ width: `${finalWidth}px`, height: `${finalHeight}px` });
    };

    calculateAndSetLayout();
    window.addEventListener('resize', calculateAndSetLayout);
    return () => window.removeEventListener('resize', calculateAndSetLayout);
  }, [headerRef, mainMenuRef, aspectRatio]);

  return { canvasStyle, mainPadding };
};
