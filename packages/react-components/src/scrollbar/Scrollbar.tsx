import React, { useEffect, useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import './Scrollbar.less';

export interface ScrollbarProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const MIN_THUMB_SIZE = 30;

export const Scrollbar: React.FC<ScrollbarProps> = ({ children, style, className }) => {
  const innerRef = useRef<HTMLDivElement>(null!);
  const vTrackRef = useRef<HTMLDivElement>(null!);
  const vThumbRef = useRef<HTMLDivElement>(null!);
  const hTrackRef = useRef<HTMLDivElement>(null!);
  const hThumbRef = useRef<HTMLDivElement>(null!);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState({ vertical: false, horizontal: false });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startScroll, setStartScroll] = useState({ left: 0, top: 0 });
  const [showScrollbar, setShowScrollbar] = useState({ vertical: false, horizontal: false });

  useEffect(() => {
    const inner = innerRef.current;
    const vTrack = vTrackRef.current;
    const vThumb = vThumbRef.current;
    const hTrack = hTrackRef.current;
    const hThumb = hThumbRef.current;

    const updateScrollbarVisibility = () => {
      const { clientHeight, scrollHeight, clientWidth, scrollWidth } = inner;
      setShowScrollbar({
        vertical: scrollHeight > clientHeight,
        horizontal: scrollWidth > clientWidth,
      });
    };

    const updateThumbPositions = () => {
      const { scrollTop, scrollLeft, clientHeight, clientWidth, scrollHeight, scrollWidth } = inner;
      const { height: vTrackHeight } = vTrack.getBoundingClientRect();
      const { width: hTrackWidth } = hTrack.getBoundingClientRect();

      // 垂直滚动条
      if (showScrollbar.vertical) {
        let vThumbHeight = (clientHeight / scrollHeight) * vTrackHeight;
        vThumbHeight = Math.max(vThumbHeight, MIN_THUMB_SIZE);
        const vScrollableHeight = vTrackHeight - vThumbHeight;
        const vScrollableContentHeight = scrollHeight - clientHeight;
        const vThumbPosition = vScrollableHeight * (scrollTop / vScrollableContentHeight);
        const vMaxPosition = vTrackHeight - vThumbHeight;
        const vFinalPosition = Math.min(vThumbPosition, vMaxPosition);

        vThumb.style.height = `${vThumbHeight}px`;
        vThumb.style.transform = `translateY(${vFinalPosition}px)`;
      }

      // 水平滚动条
      if (showScrollbar.horizontal) {
        let hThumbWidth = (clientWidth / scrollWidth) * hTrackWidth;
        hThumbWidth = Math.max(hThumbWidth, MIN_THUMB_SIZE);
        const hScrollableWidth = hTrackWidth - hThumbWidth;
        const hScrollableContentWidth = scrollWidth - clientWidth;
        const hThumbPosition = hScrollableWidth * (scrollLeft / hScrollableContentWidth);
        const hMaxPosition = hTrackWidth - hThumbWidth;
        const hFinalPosition = Math.min(hThumbPosition, hMaxPosition);

        hThumb.style.width = `${hThumbWidth}px`;
        hThumb.style.transform = `translateX(${hFinalPosition}px)`;
      }
    };

    const handleScroll = () => {
      setIsScrolling(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);

      updateThumbPositions();
    };

    const handleMouseDown = (direction: 'vertical' | 'horizontal') => (e: MouseEvent) => {
      setIsDragging((prev) => ({ ...prev, [direction]: true }));
      setStartPosition({ x: e.clientX, y: e.clientY });
      setStartScroll({ left: innerRef.current.scrollLeft, top: innerRef.current.scrollTop });
    };
    const handleVerticalMouseDown = handleMouseDown('vertical');
    const handleHorizontalMouseDown = handleMouseDown('horizontal');

    const handleMouseUp = () => {
      setIsDragging({ vertical: false, horizontal: false });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.vertical) {
        const deltaY = e.clientY - startPosition.y;
        const scrollRatio = inner.scrollHeight / inner.clientHeight;
        inner.scrollTop = startScroll.top + deltaY * scrollRatio;
      }
      if (isDragging.horizontal) {
        const deltaX = e.clientX - startPosition.x;
        const scrollRatio = inner.scrollWidth / inner.clientWidth;
        inner.scrollLeft = startScroll.left + deltaX * scrollRatio;
      }
    };

    updateScrollbarVisibility();
    updateThumbPositions();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollbarVisibility();
      updateThumbPositions();
    });
    resizeObserver.observe(inner);

    inner.addEventListener('scroll', handleScroll);
    vThumb.addEventListener('mousedown', handleVerticalMouseDown);
    hThumb.addEventListener('mousedown', handleHorizontalMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      resizeObserver.disconnect();

      inner.removeEventListener('scroll', handleScroll);
      vThumb.removeEventListener('mousedown', handleVerticalMouseDown);
      hThumb.removeEventListener('mousedown', handleHorizontalMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging.vertical,
    isDragging.horizontal,
    showScrollbar.vertical,
    showScrollbar.horizontal,
    startPosition.x,
    startPosition.y,
    startScroll.left,
    startScroll.top,
  ]);

  return (
    <div
      style={style}
      className={clsx(
        'm-scrollbar',
        {
          'm-scrollbar-scrolling': isScrolling,
          'm-scrollbar-dragging': isDragging.vertical || isDragging.horizontal,
        },
        className,
      )}
    >
      <div ref={innerRef} className="m-scrollbar-inner">
        {children}
      </div>
      <div
        ref={vTrackRef}
        className={clsx('m-scrollbar-track', 'm-scrollbar-track-vertical', {
          'm-scrollbar-track-hidden': !showScrollbar.vertical,
        })}
      >
        <div ref={vThumbRef} className="m-scrollbar-thumb"></div>
      </div>
      <div
        ref={hTrackRef}
        className={clsx('m-scrollbar-track', 'm-scrollbar-track-horizontal', {
          'm-scrollbar-track-hidden': !showScrollbar.horizontal,
        })}
      >
        <div ref={hThumbRef} className="m-scrollbar-thumb"></div>
      </div>
    </div>
  );
};
