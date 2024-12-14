import React from 'react';
import clsx from 'clsx';

export interface ScrollbarProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const Scrollbar: React.FC<ScrollbarProps> = ({ children, style, className }) => {
  return (
    <div className={clsx('m-scrollbar', className)} style={style}>
      <div className="m-scrollbar-inner">{children}</div>
      <div className="m-scrollbar-track">
        <div className="m-scrollbar-thumb"></div>
      </div>
    </div>
  );
};
