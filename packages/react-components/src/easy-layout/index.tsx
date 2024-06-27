import React, { useEffect } from 'react';
import { GridLayout } from './grid-layout';
import { FloatLayout } from './float-layout';
import { LAYOUT_MARGIN, COLUMNS, CONTAINER_PADDING, ROW_HEIGHT } from './constants';
import { DragGuideLinesProvider, useDragGuideLines } from '../drag-guide-lines';
import { calcRealPosition, calcRealSize } from './utils';
import { LayoutOption } from '../drag-guide-lines/provider';
import classNames from 'classnames';
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
  style?: React.CSSProperties;
  className?: string;
  width: number;
  layouts: EasyLayoutOption[];
  onLayoutChange?: (layouts: EasyLayoutOption[]) => void;
  enableDragGuideLines?: boolean;
  children?: React.ReactNode;
}

export const _EasyLayout: React.FC<Omit<EasyLayoutProps, 'style' | 'className' | 'enableDragGuideLines'>> = ({
  children,
  width,
  layouts,
  onLayoutChange,
}) => {
  const gridLayoutList: EasyLayoutOption[] = [];
  const floatLayoutList: EasyLayoutOption[] = [];
  const gridLayoutChildren: React.ReactNode[] = [];
  const floatLayoutChildren: React.ReactNode[] = [];

  layouts.forEach((layout, index) => {
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

  const { setLayouts } = useDragGuideLines();

  useEffect(() => {
    let result: Record<string, LayoutOption> = {};
    layouts.forEach((item) => {
      const { i, x, y, w, h } = item;
      const pos = calcRealPosition(x, y, colWidth, ROW_HEIGHT);
      const size = calcRealSize(w, h, colWidth, ROW_HEIGHT);
      result[i] = { w: size.width, h: size.height, x: pos.x, y: pos.y };
    });
    setLayouts(result);
  }, [layouts]);

  const handleLayoutChange = (layouts: EasyLayoutOption[]) => {
    const newLayoutList = layouts.map((layout) => {
      const current = layouts.find((l) => l.i === layout.i);
      return current || layout;
    });
    onLayoutChange?.(newLayoutList);
  };

  return (
    <>
      <GridLayout layoutList={gridLayoutList} colWidth={colWidth} width={width} onLayoutChange={handleLayoutChange}>
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
    </>
  );
};

export const EasyLayout: React.FC<EasyLayoutProps> = ({ style, className, enableDragGuideLines = true, ...rest }) => {
  return (
    <div style={style} className={classNames('ml-easy-layout', className)}>
      <DragGuideLinesProvider disabled={!enableDragGuideLines}>
        <_EasyLayout {...rest} />
      </DragGuideLinesProvider>
    </div>
  );
};
