import type { Meta, StoryObj } from '@storybook/react';
import { DragGuideLinesProvider } from '../src';

const meta = {
  title: 'Example/DragGuideLines',
  component: DragGuideLinesProvider,
  decorators: [(story: Function) => <div style={{ padding: 10, background: 'gray' }}>{story()}</div>],
} satisfies Meta<typeof DragGuideLinesProvider>;

export default meta;

export const Demo = () => {
  return <DragGuideLinesProvider></DragGuideLinesProvider>;
};
