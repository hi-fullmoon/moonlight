import React from 'react';
import type { Meta } from '@storybook/react';
import { Scrollbar } from '../src/scrollbar';

const meta = {
  title: 'React Components/Scrollbar',
} satisfies Meta;

export default meta;

export const Demo = () => {
  return <Scrollbar />;
};
