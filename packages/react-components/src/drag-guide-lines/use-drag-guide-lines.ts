import { useContext } from 'react';
import { DragGuideLinesContext } from './context';

export function useDragGuideLines() {
  const { setLayouts, onDrag, onDragStop } = useContext(DragGuideLinesContext);

  return {
    setLayouts,
    onDrag,
    onDragStop,
  };
}
