import React from 'react';
import type { Meta } from '@storybook/react';
import { Layout } from '../src/layout';

const meta = {
  title: 'React Components/Layout',
} satisfies Meta;

export default meta;

export const Demo = () => {
  return <Layout />;
};
