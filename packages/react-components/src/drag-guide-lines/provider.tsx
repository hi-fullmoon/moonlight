import React, { useRef } from 'react';
import { DragGuideLinesContext } from './context';
import { resolveHorizontalLines, resolveVerticalLines } from './utils';

export interface LineOption {
  top?: number;
  left?: number;
  length?: number;
  dist?: number;
}

export interface LayoutOption {
  i?: number | string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DragGuideLinesProviderProps {
  lineColor?: string;
  children?: React.ReactNode;
}

export const DragGuideLinesProvider: React.FC<DragGuideLinesProviderProps> = ({ lineColor = '#eb4c42', children }) => {
  const linesContainerRef = useRef<HTMLDivElement>(null!);
  const layoutsRef = useRef<Record<number | string, LayoutOption>>({});

  const setLayouts = (layouts: Record<number | string, LayoutOption>) => {
    layoutsRef.current = {
      ...layoutsRef.current,
      ...layouts,
    };
  };

  const handleDrag = (id: string | number, layout: LayoutOption) => {
    layoutsRef.current[id] = layout;

    const vLines: LineOption[] = [];
    const hLines: LineOption[] = [];

    for (let key in layoutsRef.current) {
      if (key === id) continue;

      const comparer = layoutsRef.current[key];
      hLines.push(...resolveHorizontalLines(layout, comparer));
      vLines.push(...resolveVerticalLines(layout, comparer));
    }

    renderLines(vLines, hLines);

    let x = layout.x;
    let y = layout.y;

    if (hLines.length > 0) {
      const line = hLines.sort((a, b) => Math.abs(a.dist!) - Math.abs(b.dist!))[0];
      if (line.dist! <= 2) {
        y = layout.y - line.dist!;
      }
    }

    if (vLines.length > 0) {
      const line = vLines.sort((a, b) => Math.abs(a.dist!) - Math.abs(b.dist!))[0];
      if (line.dist! <= 2) {
        x = layout.x - line.dist!;
      }
    }

    return { ...layout, x, y };
  };

  const handleDragStop = () => {
    linesContainerRef.current.innerHTML = '';
  };

  const renderLines = (vLines: LineOption[], hLines: LineOption[]) => {
    linesContainerRef.current.innerHTML = '';

    let linesHtmlStr = '';
    const commonStyleStr = `z-index: 1001; position: absolute; background-color: ${lineColor};`;

    vLines.forEach((line) => {
      const { top, left, length } = line;
      const styleStr = `${commonStyleStr} top: ${top}px; left: ${left}px; height: ${length}px; width: 1px;`;
      linesHtmlStr += `<span class="vertical-line" style="${styleStr}"></span>`;
    });

    hLines.forEach((line) => {
      const { top, left, length } = line;
      const styleStr = `${commonStyleStr} top: ${top}px; left: ${left}px; width: ${length}px; height: 1px;`;
      linesHtmlStr += `<span class="horizontal-line" style="${styleStr}"></span>`;
    });

    linesContainerRef.current.innerHTML = linesHtmlStr;
  };

  return (
    <DragGuideLinesContext.Provider
      value={{
        setLayouts: setLayouts,
        onDrag: handleDrag,
        onDragStop: handleDragStop,
      }}
    >
      {children}
      <div style={{ userSelect: 'none', pointerEvents: 'none' }} ref={linesContainerRef} />
    </DragGuideLinesContext.Provider>
  );
};
