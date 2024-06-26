import React, { useRef } from 'react';
import { EasyLayoutOption } from '../index';
import { FloatLayoutItem } from './FloatLayoutItem';
import './FloatLayout.css';

export interface FloatLayoutProps {
  layoutList: EasyLayoutOption[];
  rowHeight: number;
  colWidth: number;
  isResizable?: boolean;
  isDraggable?: boolean;
  onLayoutChange?: (layouts: EasyLayoutOption[]) => void;
  children?: React.ReactNode;
}

export const FloatLayout: React.FC<FloatLayoutProps> = ({
  children,
  rowHeight,
  colWidth,
  isResizable,
  isDraggable,
  layoutList,
  onLayoutChange,
}) => {
  const parsedChildren: React.ReactNode[] = [];
  if (Array.isArray(children)) {
    parsedChildren.push(...children);
  } else {
    parsedChildren.push(children);
  }

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (layout: EasyLayoutOption) => {
    const newLayoutList = layoutList.map((item) => {
      if (item.i === layout.i) return layout;
      return item;
    });
    onLayoutChange?.(newLayoutList);
  };

  return (
    <div ref={containerRef} className="react-float-layout">
      {parsedChildren.map((child, index) => {
        return (
          <FloatLayoutItem
            key={index}
            rowHeight={rowHeight}
            colWidth={colWidth}
            isResizable={isResizable}
            isDraggable={isDraggable}
            layout={layoutList[index]}
            onChange={handleChange}
          >
            {child}
          </FloatLayoutItem>
        );
      })}
    </div>
  );
};
