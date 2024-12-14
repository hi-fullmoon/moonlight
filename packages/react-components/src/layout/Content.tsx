import clsx from 'clsx';
import './Content.css';

export interface ContentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children, style, className }) => {
  return (
    <div className={clsx('m-content', className)} style={style}>
      {children}
    </div>
  );
};
