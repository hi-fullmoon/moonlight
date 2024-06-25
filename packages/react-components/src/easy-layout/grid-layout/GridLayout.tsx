import React from 'react';
import ReactGridLayout, { Layout } from 'react-grid-layout';
import { COLUMNS, CONTAINER_PADDING, LAYOUT_MARGIN, ROW_HEIGHT } from '../constants';
import { resolveGridLayout } from '../utils';
import { EasyLayoutOption } from '../index';
import 'react-grid-layout/css/styles.css';

export interface GridLayoutProps {
  width: number;
  layoutList: EasyLayoutOption[];
  isResizable?: boolean;
  isDraggable?: boolean;
  onLayoutChange?: (layoutList: EasyLayoutOption[]) => void;
  children?: React.ReactNode;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  width,
  layoutList,
  isResizable,
  isDraggable,
  onLayoutChange,
}) => {
  const handleLayoutChange = (currentLayout: Layout[]) => {
    const layouts = currentLayout.map((layout) => resolveGridLayout(layout));
    onLayoutChange?.(layouts);
  };

  return (
    <ReactGridLayout
      className="ml-easy-layout-grid-group"
      width={width}
      containerPadding={CONTAINER_PADDING}
      margin={LAYOUT_MARGIN}
      rowHeight={ROW_HEIGHT}
      cols={COLUMNS}
      layout={layoutList}
      resizeHandles={['se', 'e', 's']}
      isResizable={isResizable}
      isDraggable={isDraggable}
      onLayoutChange={handleLayoutChange}
    >
      {children}
    </ReactGridLayout>
  );
};
