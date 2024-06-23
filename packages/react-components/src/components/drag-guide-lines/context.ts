import React from 'react';
import { LayoutOption } from './provider';
import { noop } from './utils';

interface ContextValue {
  setLayouts: (layouts: Record<string | number, LayoutOption>) => void;
  onDrag: (id: string | number, layout: LayoutOption) => void;
  onDragStop: () => void;
}

const initialValues: ContextValue = {
  setLayouts: noop,
  onDrag: noop,
  onDragStop: noop,
};

export const DragGuideLinesContext = React.createContext<ContextValue>(initialValues);
