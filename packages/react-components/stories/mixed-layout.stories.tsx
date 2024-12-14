import React from 'react';
import type { Meta } from '@storybook/react';
import { MixedLayout, MixedLayoutOption } from '../src';
import { Card } from 'antd';
import { useState } from 'react';
import { styled } from 'storybook/internal/theming';

const meta = {
  title: 'React Components/MixedLayout',
  component: MixedLayout,
} satisfies Meta<typeof MixedLayout>;

export default meta;

const layouts: MixedLayoutOption[] = [
  {
    type: 'grid',
    i: '1',
    x: 0,
    y: 0,
    w: 20,
    h: 10,
  },
  {
    type: 'float',
    i: '2',
    x: 20,
    y: 10,
    w: 20,
    h: 10,
  },
  {
    type: 'grid',
    i: '3',
    x: 20,
    y: 0,
    w: 20,
    h: 10,
  },
  {
    type: 'float',
    i: '4',
    x: 5,
    y: 10,
    w: 20,
    h: 10,
  },
];
export const Demo = () => {
  const [items, setItems] = useState(layouts);

  const handleLayoutChange = (layouts: MixedLayoutOption[]) => {
    setItems(layouts);
  };

  return (
    <MixedLayout draggableHandle=".draggable-handle" width={1000} layouts={items} onLayoutChange={handleLayoutChange}>
      {items.map((item) => {
        return (
          <StyledCard key={item.i}>
            {JSON.stringify(item)}
            <span className="draggable-handle"></span>
          </StyledCard>
        );
      })}
    </MixedLayout>
  );
};

const StyledCard = styled(Card)`
  overflow: hidden;

  .draggable-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 18px;
    background: aquamarine;
    cursor: move;
    transition: 0.3s all;
    opacity: 0;
  }

  &:hover .draggable-handle {
    opacity: 1;
  }
`;
