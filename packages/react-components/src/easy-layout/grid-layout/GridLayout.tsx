import React from 'react';
import ReactGridLayout, { ItemCallback, Layout } from 'react-grid-layout';
import { COLUMNS, CONTAINER_PADDING, LAYOUT_MARGIN, ROW_HEIGHT } from '../constants';
import { calcRealPosition, calcRealSize, resolveGridLayout } from '../utils';
import { EasyLayoutOption } from '../index';
import 'react-grid-layout/css/styles.css';
import { useDragGuideLines } from '../../drag-guide-lines';

export interface GridLayoutProps {
  width: number;
  layoutList: EasyLayoutOption[];
  colWidth: number;
  isResizable?: boolean;
  isDraggable?: boolean;
  onLayoutChange?: (layoutList: EasyLayoutOption[]) => void;
  children?: React.ReactNode;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  width,
  colWidth,
  layoutList,
  isResizable,
  isDraggable,
  onLayoutChange,
}) => {
  const { onDrag: _onDrag, onDragStop: _onDragStop } = useDragGuideLines();

  const handleDrag: ItemCallback = (layout, oldItem, newItem) => {
    const { i, x, y, w, h } = newItem;
    const pos = calcRealPosition(x, y, colWidth, ROW_HEIGHT);
    const size = calcRealSize(w, h, colWidth, ROW_HEIGHT);
    _onDrag(i, { x: pos.x, y: pos.y, w: size.width, h: size.height });
  };

  const handleDragStop: ItemCallback = () => {
    _onDragStop();
  };

  const handleLayoutChange = (currentLayout: Layout[]) => {
    const layouts = currentLayout.map((layout) => resolveGridLayout(layout));
    onLayoutChange?.(layouts);
  };

  return (
    <ReactGridLayout
      width={width}
      containerPadding={CONTAINER_PADDING}
      margin={LAYOUT_MARGIN}
      rowHeight={ROW_HEIGHT}
      cols={COLUMNS}
      layout={layoutList}
      resizeHandles={['se', 'e', 's']}
      isResizable={isResizable}
      isDraggable={isDraggable}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onLayoutChange={handleLayoutChange}
    >
      {children}
    </ReactGridLayout>
  );
};
