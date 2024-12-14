import React, { useEffect, useRef, useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { calcSize, calcPosition, calcRealSize, calcRealPosition } from '../utils';
import clsx from 'clsx';
import { useDragGuideLines } from '../../drag-guide-lines';
import { MixedLayoutOption } from '../index';
import 'react-resizable/css/styles.css';

export interface FloatLayoutItemProps {
  isResizable?: boolean;
  isDraggable?: boolean;
  draggableHandle?: string;
  rowHeight: number;
  colWidth: number;
  layout: MixedLayoutOption;
  onChange: (layout: MixedLayoutOption) => void;
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
  draggableHandle,
  layout,
  children,
  colWidth,
  rowHeight,
  onChange,
}) => {
  const { i, x, y, w, h, z } = layout;

  const [zValue, setZValue] = useState(z);
  const [layoutValue, setLayoutValue] = useState<LayoutValue>(defaultLayoutValue);
  const nodeRef = useRef(null);

  const { onDrag: _onDrag, onDragStop: _onDragStop } = useDragGuideLines();

  /**
   * 计算真实的布局信息
   * width、height、top、left
   */
  useEffect(() => {
    const pos = calcRealPosition(x, y, colWidth, rowHeight);
    const itemSize = calcRealSize(w, h, colWidth, rowHeight);
    setLayoutValue((state) => ({ ...state, ...itemSize, left: pos.x, top: pos.y }));
  }, [x, y, w, h, colWidth, rowHeight]);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    e.preventDefault();
    e.stopPropagation();

    setZValue(10000);

    const newLayout = _onDrag(i, { w: layoutValue.width, h: layoutValue.height, x: data.x, y: data.y });
    setLayoutValue({ ...layoutValue, top: newLayout.y, left: newLayout.x });
  };

  const handleDragStop = (e: DraggableEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setZValue(z);

    _onDragStop();

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

  const child = React.Children.only(children) as React.ReactElement;
  const newChild = React.cloneElement(
    child,
    {
      ref: nodeRef,
      className: clsx('react-float-item', child.props.className),
      style: {
        ...child.props.style,
        width: layoutValue.width,
        height: layoutValue.height,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: zValue,
      },
    },
    child.props.children,
  );

  return (
    <Draggable
      disabled={!isDraggable}
      nodeRef={nodeRef}
      handle={draggableHandle}
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
          {newChild}
        </Resizable>
      ) : (
        newChild
      )}
    </Draggable>
  );
};
