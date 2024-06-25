import type { Meta } from '@storybook/react';
import { EasyLayout, EasyLayoutOption } from '../src';

const meta = {
  title: 'Example/EasyLayout',
  component: EasyLayout,
  decorators: [(story: Function) => <div style={{ padding: 10 }}>{story()}</div>],
} satisfies Meta<typeof EasyLayout>;

export default meta;

export const Demo = () => {
  const items: EasyLayoutOption[] = [
    {
      type: 'grid',
      i: '1',
      x: 0,
      y: 0,
      w: 2,
      h: 3,
    },
  ];
  return <EasyLayout width={1000} layoutList={items}></EasyLayout>;
};
