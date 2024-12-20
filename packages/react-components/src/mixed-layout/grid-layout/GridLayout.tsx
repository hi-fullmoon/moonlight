import React from 'react';
import ReactGridLayout, { Layout } from 'react-grid-layout';
import { COLUMNS, CONTAINER_PADDING, LAYOUT_MARGIN } from '../constants';
import { resolveGridLayout } from '../utils';
import { MixedLayoutOption } from '../index';
import 'react-grid-layout/css/styles.css';

export interface GridLayoutProps {
  width: number;
  layoutList: MixedLayoutOption[];
  colWidth: number;
  rowHeight: number;
  isResizable?: boolean;
  isDraggable?: boolean;
  draggableHandle?: string;
  onLayoutChange?: (layoutList: MixedLayoutOption[]) => void;
  children?: React.ReactNode;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  width,
  rowHeight,
  layoutList,
  isResizable,
  isDraggable,
  draggableHandle,
  onLayoutChange,
}) => {
  const handleLayoutChange = (currentLayout: Layout[]) => {
    const layouts = currentLayout.map((layout) => resolveGridLayout(layout));
    onLayoutChange?.(layouts);
  };

  return (
    <ReactGridLayout
      width={width}
      containerPadding={CONTAINER_PADDING}
      margin={LAYOUT_MARGIN}
      rowHeight={rowHeight}
      cols={COLUMNS}
      layout={layoutList}
      draggableHandle={draggableHandle}
      resizeHandles={['se', 'e', 's']}
      isResizable={isResizable}
      isDraggable={isDraggable}
      onLayoutChange={handleLayoutChange}
    >
      {children}
    </ReactGridLayout>
  );
};
