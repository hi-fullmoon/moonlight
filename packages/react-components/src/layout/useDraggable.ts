import { RefObject, useEffect, useRef } from 'react';
import { SiderPosition } from './Layout';
import { useUpdate } from '../shared/hooks/useUpdate';

interface Options {
  minSize?: number;
  maxSize?: number;
  position?: SiderPosition;
  onSizeChange?: (size: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useDraggable(
  siderRef: RefObject<HTMLElement>,
  gutterRef: RefObject<HTMLElement>,
  options: Options = {},
) {
  const { minSize = 0, maxSize = Infinity, position = 'left', onSizeChange, onDragStart, onDragEnd } = options;

  const draggingRef = useRef(false);

  const update = useUpdate();

  useEffect(() => {
    const sider = siderRef.current;
    const gutter = gutterRef.current;

    if (!sider || !gutter) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const onMousedown = (e: MouseEvent) => {
      draggingRef.current = true;
      update();

      onDragStart?.();

      startX = e.clientX;
      startY = e.clientY;

      const { width, height } = sider.getBoundingClientRect();
      startWidth = width;
      startHeight = height;

      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      if (position === 'left' || position === 'right') {
        const moveX = position === 'left' ? e.clientX - startX : startX - e.clientX;
        let newWidth = startWidth + moveX;
        newWidth = Math.min(Math.max(newWidth, minSize), maxSize);
        onSizeChange?.(newWidth);
        return;
      }

      const moveY = position === 'top' ? e.clientY - startY : startY - e.clientY;
      let newHeight = startHeight + moveY;
      newHeight = Math.min(Math.max(newHeight, minSize), maxSize);
      onSizeChange?.(newHeight);
    };

    const onMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = false;
        onDragEnd?.();
        update();
      }
    };

    gutter.addEventListener('mousedown', onMousedown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      gutter.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [position, minSize, maxSize, onSizeChange, onDragStart, onDragEnd]);

  return {
    isDragging: draggingRef.current,
  };
}
