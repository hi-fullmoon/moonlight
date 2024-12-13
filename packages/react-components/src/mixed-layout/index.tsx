import React, { useEffect, useMemo, useRef } from 'react';
import { GridLayout } from './grid-layout';
import { FloatLayout } from './float-layout';
import { ROW_HEIGHT } from './constants';
import { DragGuideLinesProvider, useDragGuideLines } from '../drag-guide-lines';
import { calcColWidth, calcRealPosition, calcRealSize } from './utils';
import { LayoutOption } from '../drag-guide-lines/provider';
import clsx from 'clsx';
import './index.css';

export type LayoutType = 'grid' | 'float';

export interface MixedLayoutOption {
  type?: LayoutType;
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z?: number;
}

export interface MixedLayoutProps {
  style?: React.CSSProperties;
  className?: string;
  width: number;
  layouts: MixedLayoutOption[];
  onLayoutChange?: (layouts: MixedLayoutOption[]) => void;
  enableDragGuideLines?: boolean;
  children?: React.ReactNode;
}

export const InternalMixedLayout: React.FC<Omit<MixedLayoutProps, 'style' | 'className' | 'enableDragGuideLines'>> = ({
  children,
  width,
  layouts,
  onLayoutChange,
}) => {
  const { gridLayoutList, floatLayoutList, gridLayoutChildren, floatLayoutChildren } = useMemo(() => {
    const gridLayoutList: MixedLayoutOption[] = [];
    const floatLayoutList: MixedLayoutOption[] = [];
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

    return {
      gridLayoutList,
      floatLayoutList,
      gridLayoutChildren,
      floatLayoutChildren,
    };
  }, [layouts, children]);

  const colWidth = calcColWidth(width);

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

  const handleLayoutChange = (items: MixedLayoutOption[]) => {
    const newLayoutList = layouts.map((layout) => {
      const current = items.find((l) => l.i === layout.i);
      return current || layout;
    });
    onLayoutChange?.(newLayoutList);
  };

  return (
    <>
      <GridLayout
        width={width}
        layoutList={gridLayoutList}
        rowHeight={ROW_HEIGHT}
        colWidth={colWidth}
        onLayoutChange={handleLayoutChange}
      >
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

export const MixedLayout: React.FC<MixedLayoutProps> = ({ style, className, enableDragGuideLines = true, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  return (
    <DragGuideLinesProvider getContainer={() => containerRef.current} disabled={!enableDragGuideLines}>
      <div ref={containerRef} style={style} className={clsx('m-mixed-layout', className)}>
        <InternalMixedLayout {...rest} />
      </div>
    </DragGuideLinesProvider>
  );
};
