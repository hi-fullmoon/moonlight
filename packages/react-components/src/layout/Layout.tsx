import React, { useEffect } from 'react';
import clsx from 'clsx';
import { LayoutContext } from './context';
import { useContext, useState } from 'react';
import './Layout.css';

export type SiderPosition = 'left' | 'right' | 'top' | 'bottom';

export interface LayoutProps {
  style?: React.CSSProperties;
  className?: string;
  siderPosition?: SiderPosition;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, style, className }) => {
  const { sider } = useContext(LayoutContext);
  const { position, dragging } = sider;

  const direction = position === 'left' || position === 'right' ? 'horizontal' : 'vertical';

  return (
    <div
      style={style}
      className={clsx(
        'm-layout',
        {
          [`m-layout-sider-${position}`]: !!position,
          [`m-layout-dragging-${direction}`]: dragging,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export const WrappedLayout: React.FC<LayoutProps> = (props) => {
  const [sider, setSider] = useState<{ position: SiderPosition; dragging: boolean }>({
    position: props.siderPosition ?? 'left',
    dragging: false,
  });

  return (
    <LayoutContext.Provider value={{ sider, setSider }}>
      <Layout {...props} />
    </LayoutContext.Provider>
  );
};

export default WrappedLayout;
