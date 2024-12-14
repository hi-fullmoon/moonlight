import { createContext } from 'react';
import { SiderPosition } from './Layout';

interface LayoutContextValue {
  sider: {
    position: SiderPosition;
    dragging: boolean;
  };
  setSider?: React.Dispatch<
    React.SetStateAction<{
      position: SiderPosition;
      dragging: boolean;
    }>
  >;
}

export const LayoutContext = createContext<LayoutContextValue>({
  sider: {
    position: 'left',
    dragging: false,
  },
});
