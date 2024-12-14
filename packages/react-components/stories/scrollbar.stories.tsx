import React from 'react';
import type { Meta } from '@storybook/react';
import { Scrollbar } from '../src/scrollbar';

const meta = {
  title: 'React Components/Scrollbar',
} satisfies Meta;

export default meta;

export const Basic = () => (
  <div style={{ height: '390px', width: '440px', backgroundColor: '#f0f0f0' }}>
    <Scrollbar>
      {Array.from({ length: 200 }).map((_, index) => (
        <div key={index} style={{ padding: '10px', marginBottom: '2px', whiteSpace: 'nowrap' }}>
          Item {index + 1} 那只是一场游戏一场梦
        </div>
      ))}
    </Scrollbar>
  </div>
);

export const Horizontal = () => (
  <div style={{ height: '390px', width: '440px', backgroundColor: '#f0f0f0' }}>
    <Scrollbar>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} style={{ padding: '10px', marginBottom: '2px', whiteSpace: 'nowrap' }}>
          Item {index + 1} 那只是一场游戏一场梦 - 这是一段很长的文字，
          这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字这是一段很长的文字
          用来测试水平滚动条 那只是一场游戏一场梦 - 这是一段很长的文字，用来测试水平滚动条
        </div>
      ))}
    </Scrollbar>
  </div>
);
