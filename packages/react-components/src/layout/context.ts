import { createContext } from 'react';
import { SiderPosition } from './Sider';

interface LayoutContextProps {
  siderPosition?: SiderPosition;
  setSiderPosition?: (position?: SiderPosition) => void;
}

export const LayoutContext = createContext<LayoutContextProps>({});
