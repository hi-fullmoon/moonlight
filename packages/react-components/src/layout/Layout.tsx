import clsx from 'clsx';
import './Layout.css';
import { LayoutContext } from './context';
import { useContext, useState, useDeferredValue } from 'react';
import { SiderPosition } from './Sider';

export interface LayoutProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, style, className }) => {
  const { siderPosition } = useContext(LayoutContext);

  return (
    <div
      className={clsx(
        'm-layout',
        {
          [`m-layout-sider-${siderPosition}`]: !!siderPosition,
          'm-layout-pending': typeof siderPosition === 'undefined',
        },
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export const WrappedLayout: React.FC<LayoutProps> = (props) => {
  const [siderPosition, setSiderPosition] = useState<SiderPosition | undefined>();

  return (
    <LayoutContext.Provider value={{ siderPosition, setSiderPosition }}>
      <Layout {...props} />
    </LayoutContext.Provider>
  );
};

export default WrappedLayout;
