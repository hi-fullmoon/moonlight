import React, { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import clsx from 'clsx';
import { throttle, round } from 'lodash-es';
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

      if (showScrollbar.vertical) {
        let vThumbHeight = round((clientHeight / scrollHeight) * vTrackHeight, 2);
        vThumbHeight = Math.max(vThumbHeight, MIN_THUMB_SIZE);
        const vScrollableHeight = vTrackHeight - vThumbHeight;
        const vScrollableContentHeight = scrollHeight - clientHeight;
        const vThumbPosition = round(vScrollableHeight * (scrollTop / vScrollableContentHeight), 2);
        const vMaxPosition = vTrackHeight - vThumbHeight;
        const vFinalPosition = Math.min(vThumbPosition, vMaxPosition);

        vThumb.style.height = `${vThumbHeight}px`;
        vThumb.style.transform = `translateY(${vFinalPosition}px)`;
      }

      if (showScrollbar.horizontal) {
        let hThumbWidth = round((clientWidth / scrollWidth) * hTrackWidth, 2);
        hThumbWidth = Math.max(hThumbWidth, MIN_THUMB_SIZE);
        const hScrollableWidth = hTrackWidth - hThumbWidth;
        const hScrollableContentWidth = scrollWidth - clientWidth;
        const hThumbPosition = round(hScrollableWidth * (scrollLeft / hScrollableContentWidth), 2);
        const hMaxPosition = hTrackWidth - hThumbWidth;
        const hFinalPosition = Math.min(hThumbPosition, hMaxPosition);

        hThumb.style.width = `${hThumbWidth}px`;
        hThumb.style.transform = `translateX(${hFinalPosition}px)`;
      }
    }, [showScrollbar.vertical, showScrollbar.horizontal]);

    useEffect(() => {
      const handleMouseUp = () => {
        if (!isDragging.vertical && !isDragging.horizontal) {
          return;
        }

        setIsDragging({ vertical: false, horizontal: false });
      };

      const handleMouseMove = (e: MouseEvent) => {
        const content = contentRef.current;
        if (isDragging.vertical) {
          const deltaY = e.clientY - startPositionRef.current.y;
          const scrollRatio = content.scrollHeight / content.clientHeight;
          const top = startScrollRef.current.top + deltaY * scrollRatio;
          content.scrollTo({ top, behavior: 'instant' });
        }
        if (isDragging.horizontal) {
          const deltaX = e.clientX - startPositionRef.current.x;
          const scrollRatio = content.scrollWidth / content.clientWidth;
          const left = startScrollRef.current.left + deltaX * scrollRatio;
          content.scrollTo({ left, behavior: 'instant' });
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
      updateScrollbarVisibility();
      updateThumbPositions();

      const resizeObserver = new ResizeObserver(
        throttle(() => {
          updateScrollbarVisibility();
          updateThumbPositions();
        }, 16),
      );
      resizeObserver.observe(contentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [updateScrollbarVisibility, updateThumbPositions]);

    const handleContentScroll = useCallback(
      throttle((e: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(e);

        setIsScrolling(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 500);

        updateThumbPositions();
      }, 16),
      [onScroll, updateThumbPositions],
    );

    const handleContentWheel = useCallback(
      throttle((e: React.WheelEvent<HTMLDivElement>) => {
        const deltaX = e.deltaX;
        const deltaY = e.deltaY;

        const content = contentRef.current;
        if (showScrollbar.vertical) {
          content.scrollTop += deltaY;
        }
        if (showScrollbar.horizontal) {
          content.scrollLeft += deltaX;
        }
      }, 16),
      [showScrollbar.vertical, showScrollbar.horizontal],
    );

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>, isVertical: boolean) => {
      if (e.target !== e.currentTarget) return;

      const content = contentRef.current;
      const track = isVertical ? vTrackRef.current : hTrackRef.current;
      const thumb = isVertical ? vThumbRef.current : hThumbRef.current;

      const trackRect = track.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();

      if (isVertical) {
        const thumbTop = e.clientY - trackRect.top - thumbRect.height / 2;
        const ratio = Math.max(0, Math.min(thumbTop / (trackRect.height - thumbRect.height), 1));
        const scrollTop = round(ratio * (content.scrollHeight - content.clientHeight), 2);
        content.scrollTo({ top: scrollTop, behavior: 'smooth' });
      } else {
        const thumbLeft = e.clientX - trackRect.left - thumbRect.width / 2;
        const ratio = Math.max(0, Math.min(thumbLeft / (trackRect.width - thumbRect.width), 1));
        const scrollLeft = round(ratio * (content.scrollWidth - content.clientWidth), 2);
        content.scrollTo({ left: scrollLeft, behavior: 'smooth' });
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
          ref={hTrackRef}
          className={clsx('m-scrollbar-track', 'm-scrollbar-track-horizontal', {
            'm-scrollbar-track-hidden': !showScrollbar.horizontal,
          })}
          onClick={(e) => handleTrackClick(e, false)}
        >
          <div ref={hThumbRef} className="m-scrollbar-thumb" onMouseDown={handleHThumbMouseDown} />
        </div>
        <div
          ref={vTrackRef}
          className={clsx('m-scrollbar-track', 'm-scrollbar-track-vertical', {
            'm-scrollbar-track-hidden': !showScrollbar.vertical,
          })}
          onClick={(e) => handleTrackClick(e, true)}
        >
          <div ref={vThumbRef} className="m-scrollbar-thumb" onMouseDown={handleVThumbMouseDown} />
        </div>
      </div>
    );
  },
);
