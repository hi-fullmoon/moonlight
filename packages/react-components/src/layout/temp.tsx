// @ts-nocheck

import { LeftOutlined } from '@bixi-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { usePropsValue } from '@stories/hooks';
import { useUpdate } from 'ahooks';
import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';

export interface ICollapsibleLayoutProps {
  style?: React.CSSProperties;
  className?: string;
  // sider
  sider?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  // sider options
  siderOptions?: {
    // sider 位置
    position?: 'left' | 'right' | 'top' | 'bottom';
    // sider 默认 size，position 为 left 和 right 时就是 width，positon 为 top 和 bottom 时就是 height
    defaultSize?: number;
    // sider size，position 为 left 和 right 时就是 width，positon 为 top 和 bottom 时就是 height
    size?: number;
    // 是否支持侧栏收起
    collapsible?: boolean;
    // 默认收起状态
    defaultCollapsed?: boolean;
    // sider 收起状态
    collapsed?: boolean;
    // sider 收起和展开的回调
    onCollapsedChange?: (collapsed: boolean) => void;
    // sider 收起后的 size，position 为 left 和 right 时就是 width，positon 为 top 和 bottom 时就是 height
    collapsedSize?: number;
    // sider 最小的 size，position 为 left 和 right 时就是 width，positon 为 top 和 bottom 时就是 height
    minSize?: number;
    // sider 最大的 size，position 为 left 和 right 时就是 width，positon 为 top 和 bottom 时就是 height
    maxSize?: number;
    // 是否支持侧栏宽度可伸缩
    resizable?: boolean;
    // sider resize 的回调
    onResize?: (width: number) => void;
  };
  // 主要内容
  children?: React.ReactNode;
}

export const CollapsibleLayout: React.FC<ICollapsibleLayoutProps> = ({
  style,
  className,
  sider,
  siderOptions,
  children,
}) => {
  const {
    position = 'left',
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
  } = siderOptions ?? {};

  const hasSider = !!sider;

  const [size, setSize] = usePropsValue<number>({
    defaultValue: defaultSiderSize,
    value: siderSize,
  });
  const [collapsed, setCollapsed] = usePropsValue<boolean>({
    defaultValue: defaultSiderCollapsed,
    value: siderCollapsed,
    onChange: onSiderCollapsedChange,
  });

  const draggingRef = useRef(false);

  const siderRef = useRef<HTMLDivElement>(null!);
  const gutterRef = useRef<HTMLDivElement>(null!);

  const update = useUpdate();

  useEffect(() => {
    if (!siderResizable || !hasSider) {
      return;
    }

    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const gutterDom = gutterRef.current;

    const onMousedown = (e: MouseEvent) => {
      draggingRef.current = true;

      startX = e.clientX;
      startY = e.clientY;

      const { width, height } = siderRef.current.getBoundingClientRect();
      startWidth = width;
      startHeight = height;

      update();

      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) {
        if (position === 'left' || position === 'right') {
          const moveX = position === 'left' ? e.clientX - startX : startX - e.clientX;
          let newWidth = startWidth + moveX;
          if (newWidth <= siderMinSize) newWidth = siderMinSize;
          if (newWidth >= siderMaxSize) newWidth = siderMaxSize;
          setSize(newWidth);
          onSiderResize?.(newWidth);
          return;
        }

        const moveY = position === 'top' ? e.clientY - startY : startY - e.clientY;
        let newHeight = startHeight + moveY;
        if (newHeight <= siderMinSize) newHeight = siderMinSize;
        if (newHeight >= siderMaxSize) newHeight = siderMaxSize;
        setSize(newHeight);
        onSiderResize?.(newHeight);
      }
    };

    const onMouseUp = () => {
      draggingRef.current = false;
      update();
    };

    gutterDom.addEventListener('mousedown', onMousedown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      gutterDom.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siderResizable, hasSider, siderMinSize, siderMaxSize]);

  const onIconClick = () => {
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
    if (position === 'left') return <LeftOutlined rotate={collapsed ? 180 : 0} />;
    if (position === 'right') return <LeftOutlined rotate={collapsed ? 0 : 180} />;
    if (position === 'top') return <LeftOutlined rotate={collapsed ? -90 : 90} />;
    if (position === 'bottom') return <LeftOutlined rotate={collapsed ? 90 : 270} />;
    return null;
  };

  return (
    <StyledContainer
      style={style}
      className={classNames(className, 'kms-collapsible-layout', `kms-collapsible-layout-${position}`)}
    >
      {sider && (
        <StyledSider
          ref={siderRef}
          style={getSiderStyle()}
          className={classNames('kms-collapsible-layout-sider', `kms-collapsible-layout-sider-${position}`)}
          isDragging={draggingRef.current}
        >
          {typeof sider === 'function' ? sider(collapsed) : sider}
          {siderCollapsible && (
            <StyledTrigger
              className={classNames('kms-collapsible-layout-trigger', `kms-collapsible-layout-trigger-${position}`)}
              onClick={onIconClick}
            >
              {getArrowIcon()}
            </StyledTrigger>
          )}
        </StyledSider>
      )}
      <StyledGutter
        ref={gutterRef}
        className={classNames('kms-collapsible-layout-gutter', `kms-collapsible-layout-gutter-${position}`)}
        visible={!collapsed && hasSider && siderResizable}
        isDragging={draggingRef.current}
      />
      <StyledContent className="kms-collapsible-layout-content">{children}</StyledContent>
      {draggingRef.current && (
        <StyledMask
          style={{
            cursor: position === 'left' || position === 'right' ? 'col-resize' : 'row-resize',
          }}
        />
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;

  &.kms-collapsible-layout-left {
    flex-direction: row;
  }

  &.kms-collapsible-layout-right {
    flex-direction: row-reverse;
  }

  &.kms-collapsible-layout-top {
    flex-direction: column;
  }

  &.kms-collapsible-layout-bottom {
    flex-direction: column-reverse;
  }

  &.kms-collapsible-layout-left,
  &.kms-collapsible-layout-right {
    .kms-collapsible-layout-content {
      width: 0;
      height: 100%;
    }
  }

  &.kms-collapsible-layout-top,
  &.kms-collapsible-layout-bottom {
    .kms-collapsible-layout-content {
      width: 100%;
      height: 0;
    }
  }
`;

const StyledSider = styled.div<{ isDragging: boolean }>`
  position: relative;
  width: 240px;
  height: 100%;
  transition: ${(props) => (props.isDragging ? 'unset' : '0.1s width ease-out')};

  &.kms-collapsible-layout-sider-left,
  &.kms-collapsible-layout-sider-right {
    width: 240px;
    height: 100%;
  }

  &.kms-collapsible-layout-sider-top,
  &.kms-collapsible-layout-sider-bottom {
    width: 100%;
    height: 240px;
  }
`;

const StyledTrigger = styled.div`
  box-sizing: border-box;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--kms-grey-2);
  z-index: 100;
  cursor: pointer;

  &.kms-collapsible-layout-trigger-left {
    top: 120px;
    right: -10px;
    width: 10px;
    height: 58px;
    padding: 23px 0;
    border-radius: 0 6px 6px 0;
  }

  &.kms-collapsible-layout-trigger-right {
    top: 120px;
    left: -10px;
    width: 10px;
    height: 58px;
    padding: 23px 0;
    border-radius: 6px 0 0 6px;
  }

  &.kms-collapsible-layout-trigger-top {
    bottom: -10px;
    right: 50%;
    width: 58px;
    height: 10px;
    padding: 0 23px;
    transform: translateX(-50%);
    border-radius: 0 0 6px 6px;
  }

  &.kms-collapsible-layout-trigger-bottom {
    top: -10px;
    right: 50%;
    width: 58px;
    height: 10px;
    padding: 0 23px;
    transform: translateX(-50%);
    border-radius: 6px 6px 0 0;
  }
`;

const StyledGutter = styled.div<{ visible: boolean; isDragging: boolean }>`
  z-index: ${(props) => (props.isDragging ? 999 : 99)};
  position: relative;
  user-select: none;

  &.kms-collapsible-layout-gutter-left,
  &.kms-collapsible-layout-gutter-right {
    width: 0;
    height: 100%;
    cursor: col-resize;

    &::before {
      top: 0;
      left: 0;
      width: 2px;
      height: 100%;
    }

    &::after {
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
    }
  }

  &.kms-collapsible-layout-gutter-top,
  &.kms-collapsible-layout-gutter-bottom {
    width: 100%;
    height: 0;
    cursor: row-resize;

    &::before {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
    }

    &::after {
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
    }
  }

  &:hover::before {
    background: var(--kms-brand-5);
  }

  ${(props) =>
    props.visible &&
    css`
      &::before {
        content: '';
        position: absolute;
        transition: 0.2s background-color;
        transition-delay: 0.3s;
        background-color: ${props.isDragging ? 'var(--kms-brand-5)' : 'transparent'};
      }

      &::after {
        content: '';
        position: absolute;
      }
    `};
`;

const StyledContent = styled.div`
  flex: 1;
  width: 0;
  height: 100%;
`;

const StyledMask = styled.div`
  z-index: 9999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
`;
