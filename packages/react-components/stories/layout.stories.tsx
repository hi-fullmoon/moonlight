import React from 'react';
import type { Meta } from '@storybook/react';
import { Layout } from '../src/layout';

const Sider = Layout.Sider;
const Content = Layout.Content;

const meta = {
  title: 'React Components/Layout',
} satisfies Meta;

export default meta;

export const Demo = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const SiderTop = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable position="top">
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const SiderRight = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable position="right">
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const SiderBottom = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable position="bottom">
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};
