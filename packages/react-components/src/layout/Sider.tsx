import clsx from 'clsx';
import { useCallback, useContext, useEffect } from 'react';
import { useRef } from 'react';
import { usePropsValue } from '../shared/hooks/usePropsValue';
import { IconLeft } from './IconLeft';
import { LayoutContext } from './context';
import { useDraggable } from './useDraggable';
import './Sider.css';

export interface SiderProps {
  children?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  style?: React.CSSProperties;
  className?: string;
  // sider 默认 size，position 为 left 和 right 时就是 width，position 为 top 和 bottom 时就是 height
  defaultSize?: number;
  // sider size，position 为 left 和 right 时就是 width，position 为 top 和 bottom 时就是 height
  size?: number;
  // 是否支持侧栏收起
  collapsible?: boolean;
  // 默认收起状态
  defaultCollapsed?: boolean;
  // sider 收起状态
  collapsed?: boolean;
  // 触发收起和展开的 icon
  triggerIcon?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  // sider 收起和展开的回调
  onCollapsedChange?: (collapsed: boolean) => void;
  // sider 收起后的 size，position 为 left 和 right 时就是 width，position 为 top 和 bottom 时就是 height
  collapsedSize?: number;
  // sider 最小的 size，position 为 left 和 right 时就是 width，position 为 top 和 bottom 时就是 height
  minSize?: number;
  // sider 最大的 size，position 为 left 和 right 时就是 width，position 为 top 和 bottom 时就是 height
  maxSize?: number;
  // 是否支持侧栏宽度可伸缩
  resizable?: boolean;
  // sider resize 的回调
  onResize?: (width: number) => void;
}

export const Sider: React.FC<SiderProps> = (props) => {
  const { sider, setSider } = useContext(LayoutContext);
  const { position, dragging: isDragging } = sider;

  const {
    style,
    className,
    children,
    defaultSize: defaultSiderSize = 240,
    size: siderSize,
    minSize: siderMinSize = 200,
    maxSize: siderMaxSize = 480,
    collapsedSize: siderCollapsedSize = 50,
    defaultCollapsed: defaultSiderCollapsed = false,
    collapsed: siderCollapsed,
    collapsible: siderCollapsible = true,
    resizable: siderResizable = true,
    onResize: onSiderResize,
    onCollapsedChange: onSiderCollapsedChange,
    triggerIcon: siderTriggerIcon,
  } = props ?? {};

  const [size, setSize] = usePropsValue<number>({
    defaultValue: defaultSiderSize,
    value: siderSize,
  });
  const [collapsed, setCollapsed] = usePropsValue<boolean>({
    defaultValue: defaultSiderCollapsed,
    value: siderCollapsed,
    onChange: onSiderCollapsedChange,
  });

  const siderRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const handleSizeChange = useCallback(
    (newSize: number) => {
      setSize(newSize);
      onSiderResize?.(newSize);
    },
    [setSize, onSiderResize],
  );

  const handleDragStart = useCallback(() => {
    setSider?.((prev) => ({ ...prev, dragging: true }));
  }, [setSider]);

  const handleDragEnd = useCallback(() => {
    setSider?.((prev) => ({ ...prev, dragging: false }));
  }, [setSider]);

  useDraggable(siderRef, gutterRef, {
    position,
    minSize: siderMinSize,
    maxSize: siderMaxSize,
    onSizeChange: handleSizeChange,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  });

  const handleIconClick = () => {
    setCollapsed(!collapsed);
    onSiderCollapsedChange?.(!collapsed);
  };

  const getSiderStyle = () => {
    if (['left', 'right'].includes(position)) {
      return {
        width: collapsed ? siderCollapsedSize : size,
      };
    }
    return {
      height: collapsed ? siderCollapsedSize : size,
    };
  };

  const getArrowIcon = () => {
    if (position === 'left') return <IconLeft rotate={collapsed ? 180 : 0} />;
    if (position === 'right') return <IconLeft rotate={collapsed ? 0 : 180} />;
    if (position === 'top') return <IconLeft rotate={collapsed ? -90 : 90} />;
    if (position === 'bottom') return <IconLeft rotate={collapsed ? 90 : 270} />;
    return null;
  };

  return (
    <>
      <div
        ref={siderRef}
        style={{ ...style, ...getSiderStyle() }}
        className={clsx(
          'm-sider',
          `m-sider-${position}`,
          {
            'm-sider-dragging': isDragging,
          },
          className,
        )}
      >
        {typeof children === 'function' ? children(collapsed) : children}
        {siderCollapsible && (
          <div
            className={clsx('m-sider-collapse-trigger', `m-sider-collapse-trigger-${position}`)}
            onClick={handleIconClick}
          >
            {typeof siderTriggerIcon === 'function' ? siderTriggerIcon(collapsed) : siderTriggerIcon || getArrowIcon()}
          </div>
        )}
      </div>
      <div
        ref={gutterRef}
        className={clsx('m-layout-gutter', `m-layout-gutter-${position}`, {
          'm-layout-gutter-dragging': isDragging,
          'm-layout-gutter-hidden': collapsed || !siderResizable,
        })}
      />
    </>
  );
};
