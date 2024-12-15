import React, { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import clsx from 'clsx';
import './Scrollbar.less';

export interface ScrollbarProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export interface ScrollbarRef {
  scrollTo: (options: ScrollToOptions) => void;
}

const MIN_THUMB_SIZE = 30;

export const Scrollbar = React.forwardRef<ScrollbarRef, ScrollbarProps>(
  ({ children, style, className, onScroll }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null!);
    const vTrackRef = useRef<HTMLDivElement>(null!);
    const vThumbRef = useRef<HTMLDivElement>(null!);
    const hTrackRef = useRef<HTMLDivElement>(null!);
    const hThumbRef = useRef<HTMLDivElement>(null!);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startPositionRef = useRef({ x: 0, y: 0 });
    const startScrollRef = useRef({ left: 0, top: 0 });

    const [isScrolling, setIsScrolling] = useState(false);
    const [showScrollbar, setShowScrollbar] = useState({ vertical: false, horizontal: false });
    const [isDragging, setIsDragging] = useState({ vertical: false, horizontal: false });

    useImperativeHandle(ref, () => ({
      scrollTo: (options: ScrollToOptions) => {
        contentRef.current.scrollTo(options);
        updateThumbPositions();
      },
    }));

    const updateScrollbarVisibility = useCallback(() => {
      const { clientHeight, scrollHeight, clientWidth, scrollWidth } = contentRef.current;
      setShowScrollbar({
        vertical: scrollHeight > clientHeight,
        horizontal: scrollWidth > clientWidth,
      });
    }, []);

    const updateThumbPositions = useCallback(() => {
      const content = contentRef.current;
      const vTrack = vTrackRef.current;
      const vThumb = vThumbRef.current;
      const hTrack = hTrackRef.current;
      const hThumb = hThumbRef.current;

      const { scrollTop, scrollLeft, clientHeight, clientWidth, scrollHeight, scrollWidth } = content;
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
    }, [showScrollbar.vertical, showScrollbar.horizontal]);

    useEffect(() => {
      const handleMouseUp = () => {
        setIsDragging({ vertical: false, horizontal: false });
      };

      const handleMouseMove = (e: MouseEvent) => {
        const content = contentRef.current;
        if (isDragging.vertical) {
          const deltaY = e.clientY - startPositionRef.current.y;
          const scrollRatio = content.scrollHeight / content.clientHeight;
          content.scrollTop = startScrollRef.current.top + deltaY * scrollRatio;
        }
        if (isDragging.horizontal) {
          const deltaX = e.clientX - startPositionRef.current.x;
          const scrollRatio = content.scrollWidth / content.clientWidth;
          content.scrollLeft = startScrollRef.current.left + deltaX * scrollRatio;
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging.vertical, isDragging.horizontal]);

    useEffect(() => {
      const content = contentRef.current;
      const resizeObserver = new ResizeObserver(() => {
        updateScrollbarVisibility();
        updateThumbPositions();
      });
      resizeObserver.observe(content);

      updateScrollbarVisibility();
      updateThumbPositions();

      return () => {
        resizeObserver.disconnect();
      };
    }, [updateScrollbarVisibility, updateThumbPositions]);

    const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
      onScroll?.(e);

      setIsScrolling(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);

      updateThumbPositions();
    };

    const handleContentWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      const deltaX = e.deltaX;
      const deltaY = e.deltaY;

      const content = contentRef.current;
      if (showScrollbar.vertical) {
        content.scrollTop += deltaY;
      }
      if (showScrollbar.horizontal) {
        content.scrollLeft += deltaX;
      }
    };

    const handleVThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      startPositionRef.current = { x: e.clientX, y: e.clientY };
      const content = contentRef.current;
      startScrollRef.current = { left: content.scrollLeft, top: content.scrollTop };
      setIsDragging((prevState) => ({ ...prevState, vertical: true }));
    };

    const handleHThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      startPositionRef.current = { x: e.clientX, y: e.clientY };
      const content = contentRef.current;
      startScrollRef.current = { left: content.scrollLeft, top: content.scrollTop };
      setIsDragging((prevState) => ({ ...prevState, horizontal: true }));
    };

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
        <div
          ref={contentRef}
          className="m-scrollbar-content"
          onScroll={handleContentScroll}
          onWheel={handleContentWheel}
        >
          {children}
        </div>
        <div
          ref={vTrackRef}
          className={clsx('m-scrollbar-track', 'm-scrollbar-track-vertical', {
            'm-scrollbar-track-hidden': !showScrollbar.vertical,
          })}
        >
          <div ref={vThumbRef} className="m-scrollbar-thumb" onMouseDown={handleVThumbMouseDown}></div>
        </div>
        <div
          ref={hTrackRef}
          className={clsx('m-scrollbar-track', 'm-scrollbar-track-horizontal', {
            'm-scrollbar-track-hidden': !showScrollbar.horizontal,
          })}
        >
          <div ref={hThumbRef} className="m-scrollbar-thumb" onMouseDown={handleHThumbMouseDown}></div>
        </div>
      </div>
    );
  },
);
