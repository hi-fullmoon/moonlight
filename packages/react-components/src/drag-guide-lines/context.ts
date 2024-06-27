import React from 'react';
import { LayoutOption } from './provider';
import { noop } from './utils';

interface ContextValue {
  setLayouts: (layouts: Record<string | number, LayoutOption>) => void;
  onDrag: (id: string | number, layout: LayoutOption) => LayoutOption;
  onDragStop: () => void;
}

const initialValues: ContextValue = {
  setLayouts: noop,
  onDrag: () => ({ x: 0, y: 0, w: 0, h: 0 }),
  onDragStop: noop,
};

export const DragGuideLinesContext = React.createContext<ContextValue>(initialValues);
