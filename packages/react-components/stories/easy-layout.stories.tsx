import type { Meta } from '@storybook/react';
import { EasyLayout, EasyLayoutOption } from '../src';
import { Card } from 'antd';
import { useState } from 'react';

const meta = {
  title: 'Example/EasyLayout',
  component: EasyLayout,
} satisfies Meta<typeof EasyLayout>;

export default meta;

const layouts: EasyLayoutOption[] = [
  {
    type: 'grid',
    i: '1',
    x: 0,
    y: 0,
    w: 20,
    h: 30,
  },
  {
    type: 'float',
    i: '2',
    x: 20,
    y: 0,
    w: 20,
    h: 10,
  },
  {
    type: 'grid',
    i: '3',
    x: 20,
    y: 0,
    w: 20,
    h: 30,
  },
  {
    type: 'float',
    i: '4',
    x: 0,
    y: 0,
    w: 20,
    h: 10,
  },
];
export const Demo = () => {
  const [items, setItems] = useState(layouts);

  const handleLayoutChange = (layouts: EasyLayoutOption[]) => {
    setItems(layouts);
  };

  return (
    <EasyLayout style={{ background: 'gray' }} width={1000} layouts={items} onLayoutChange={handleLayoutChange}>
      {items.map((item) => {
        return <Card key={item.i}>{JSON.stringify(item)}</Card>;
      })}
    </EasyLayout>
  );
};
