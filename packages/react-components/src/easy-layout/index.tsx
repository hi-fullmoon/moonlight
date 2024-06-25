import React from 'react';
import { GridLayout } from './grid-layout';
import { FloatLayout } from './float-layout';
import { LAYOUT_MARGIN, COLUMNS, CONTAINER_PADDING, ROW_HEIGHT } from './constants';
import './index.css';

export type LayoutType = 'grid' | 'float';

export interface EasyLayoutOption {
  type?: LayoutType;
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
}

export interface EasyLayoutProps {
  width: number;
  layoutList: EasyLayoutOption[];
  onLayoutChange?: (layouts: EasyLayoutOption[]) => void;
  children?: React.ReactNode;
}

export const EasyLayout: React.FC<EasyLayoutProps> = ({ children, width, layoutList, onLayoutChange }) => {
  const gridLayoutList: EasyLayoutOption[] = [];
  const floatLayoutList: EasyLayoutOption[] = [];
  const gridLayoutChildren: React.ReactNode[] = [];
  const floatLayoutChildren: React.ReactNode[] = [];

  layoutList.forEach((layout, index) => {
    const _children = (children as React.ReactNode[])[index];
    if (layout.type === 'grid') {
      gridLayoutList.push(layout);
      gridLayoutChildren.push(_children);
    } else {
      floatLayoutList.push(layout);
      floatLayoutChildren.push(_children);
    }
  });

  const colWidth = (width - LAYOUT_MARGIN[0] * (COLUMNS - 1) - CONTAINER_PADDING[0] * 2) / COLUMNS;

  const handleLayoutChange = (layouts: EasyLayoutOption[]) => {
    const newLayoutList = layoutList.map((layout) => {
      const current = layouts.find((l) => l.i === layout.i);
      return current || layout;
    });
    onLayoutChange?.(newLayoutList);
  };

  return (
    <div className="ml-easy-layout">
      <GridLayout layoutList={gridLayoutList} width={width} onLayoutChange={handleLayoutChange}>
        {gridLayoutChildren}
      </GridLayout>
      <FloatLayout
        layoutList={floatLayoutList}
        rowHeight={ROW_HEIGHT}
        colWidth={colWidth}
        onLayoutChange={handleLayoutChange}
      >
        {floatLayoutChildren}
      </FloatLayout>
    </div>
  );
};
