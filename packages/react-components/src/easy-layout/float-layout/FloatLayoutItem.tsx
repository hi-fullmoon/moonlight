import React, { useEffect, useRef, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { calcSize, calcPosition, calcRealSize, calcRealPosition } from '../utils';
import 'react-resizable/css/styles.css';
import { EasyLayoutOption } from '../index';
import './FloatLayoutItem.css';

export interface FloatLayoutItemProps {
  isResizable?: boolean;
  isDraggable?: boolean;
  rowHeight: number;
  colWidth: number;
  layout: EasyLayoutOption;
  onChange: (layout: EasyLayoutOption) => void;
  children?: React.ReactNode;
}

export interface LayoutValue {
  width: number;
  height: number;
  top: number;
  left: number;
}

const defaultLayoutValue = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
};

export const FloatLayoutItem: React.FC<FloatLayoutItemProps> = ({
  isDraggable = true,
  isResizable = true,
  layout,
  children,
  colWidth,
  rowHeight,
  onChange,
}) => {
  const nodeRef = useRef(null);
  const [layoutValue, setLayoutValue] = useState<LayoutValue>(defaultLayoutValue);

  const { x, y, w, h, z } = layout;

  /**
   * 计算真实的布局信息
   * width/height/top/left
   */
  useEffect(() => {
    const pos = calcRealPosition(x, y, colWidth, rowHeight);
    const itemSize = calcRealSize(w, h, colWidth, rowHeight);
    setLayoutValue((state) => ({ ...state, ...itemSize, left: pos.x, top: pos.y }));
  }, [x, y, w, h, colWidth, rowHeight]);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    e.preventDefault();
    e.stopPropagation();

    const newValue = { ...layoutValue, top: data.y, left: data.x };
    setLayoutValue(newValue);
  };

  const handleDragStop = (e: DraggableEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const pos = calcPosition(layoutValue.left, layoutValue.top, colWidth, rowHeight);
    onChange({ ...layout, x: pos.x, y: pos.y });
  };

  const handleResize = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
    e.preventDefault();
    e.stopPropagation();

    const newValue = { ...layoutValue, ...data.size };
    setLayoutValue(newValue);
  };

  const handleResizeStop = () => {
    const size = calcSize(layoutValue.width, layoutValue.height, colWidth, rowHeight);
    onChange({ ...layout, w: size.width, h: size.height });
  };

  if (!layoutValue) return null;

  const content = (
    <div
      ref={nodeRef}
      className="ml-easy-layout-float-item"
      style={{
        width: layoutValue.width,
        height: layoutValue.height,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: z,
      }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          ...child.props,
          style: {
            ...child.props.style,
            width: '100%',
            height: '100%',
          },
        });
      })}
      {isDraggable && <div className="ml-easy-layout-handle" />}
    </div>
  );

  return (
    <Draggable
      disabled={!isDraggable}
      nodeRef={nodeRef}
      handle=".ml-easy-layout-handle"
      position={{
        x: layoutValue.left,
        y: layoutValue.top,
      }}
      onDrag={handleDrag}
      onStop={handleDragStop}
    >
      {isResizable ? (
        <Resizable
          resizeHandles={['s', 'e', 'se']}
          width={layoutValue.width}
          height={layoutValue.height}
          onResize={handleResize}
          onResizeStop={handleResizeStop}
        >
          {content}
        </Resizable>
      ) : (
        content
      )}
    </Draggable>
  );
};
