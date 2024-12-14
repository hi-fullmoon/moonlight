import clsx from 'clsx';
import './Content.css';

export interface ContentProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children, style, className }) => {
  return (
    <div style={style} className={clsx('m-content', className)}>
      {children}
    </div>
  );
};
