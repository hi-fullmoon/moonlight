import React, { useRef } from 'react';
import type { Meta } from '@storybook/react';
import { ResizableBox } from 'react-resizable';
import { Scrollbar, ScrollbarRef } from '../src/Scrollbar';
import 'react-resizable/css/styles.css';

const meta = {
  title: 'React Components/Scrollbar',
} satisfies Meta;

export default meta;

export const Basic = () => (
  <div style={{ width: '300px', height: '390px', marginTop: '10px', backgroundColor: '#f0f0f0' }}>
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
  <div style={{ width: '300px', height: '390px', marginTop: '10px', backgroundColor: '#f0f0f0' }}>
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

export const ScrollTo = () => {
  const scrollbarRef = useRef<ScrollbarRef>(null);
  return (
    <>
      <button onClick={() => scrollbarRef.current?.scrollTo({ top: 500 })}>Scroll to</button>
      <div style={{ width: '300px', height: '400px', marginTop: '10px', backgroundColor: '#f0f0f0' }}>
        <Scrollbar ref={scrollbarRef}>
          {Array.from({ length: 200 }).map((_, index) => (
            <div key={index} style={{ padding: '10px', marginBottom: '2px', whiteSpace: 'nowrap' }}>
              Item {index + 1} 那只是一场游戏一场梦
            </div>
          ))}
        </Scrollbar>
      </div>
    </>
  );
};

export const Responsive = () => (
  <ResizableBox width={400} height={300}>
    <div style={{ width: '100%', height: '100%', borderRadius: '4px', backgroundColor: '#f0f0f0' }}>
      <Scrollbar>
        {Array.from({ length: 200 }).map((_, index) => (
          <div key={index} style={{ padding: '10px', marginBottom: '2px', whiteSpace: 'nowrap' }}>
            Item {index + 1} 那只是一场游戏一场梦
          </div>
        ))}
      </Scrollbar>
    </div>
  </ResizableBox>
);

export const Performance = () => (
  <div style={{ width: '300px', height: '400px', marginTop: '10px', backgroundColor: '#f0f0f0' }}>
    <Scrollbar>
      {Array.from({ length: 4000 }).map((_, index) => (
        <div key={index} style={{ padding: '10px', marginBottom: '2px', whiteSpace: 'nowrap' }}>
          Item {index + 1} 那只是一场游戏一场梦 这是一段很长的文字，用来测试水平滚动条 那只是一场游戏一场梦
          这是一段很长的文字，用来测试水平滚动条 那只是一场游戏一场梦 这是一段很长的文字，用来测试水平滚动条
          那只是一场游戏一场梦 这是一段很长的文字，用来测试水平滚动条 那只是一场游戏一场梦
          这是一段很长的文字，用来测试水平滚动条 那只是一场游戏一场梦 这是一段很长的文字，用来测试水平滚动条
          那只是一场游戏一场梦
        </div>
      ))}
    </Scrollbar>
  </div>
);
