import React from 'react';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { genRule } from './utils';

export interface QueryBuilderProps {
  style?: React.CSSProperties;
  className?: string;
}

const defaultTreeData = {
  id: nanoid(8),
  root: true,
  type: 'GROUP',
  combinator: 'AND',
  children: [genRule()],
};

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ style, className }) => {
  const renderTree = () => {};
  return <div style={style} className={clsx('ml-query-builder', className)}></div>;
};
