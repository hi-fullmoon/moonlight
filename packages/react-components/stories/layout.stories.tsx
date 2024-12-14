import React from 'react';
import type { Meta } from '@storybook/react';
import { Layout } from '../src/layout';

const Sider = Layout.Sider;
const Content = Layout.Content;

const meta = {
  title: 'React Components/Layout',
} satisfies Meta;

export default meta;

export const BasicLayout = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const NoSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const TopSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }} siderPosition="top">
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const RightSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }} siderPosition="right">
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const BottomSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }} siderPosition="bottom">
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const LeftSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }} siderPosition="left">
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible resizable>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const NonCollapsibleSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }} siderPosition="left">
      <Sider style={{ backgroundColor: '#f0f2f5' }} collapsible={false}>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};

export const NonResizableSider = () => {
  return (
    <Layout style={{ width: '100%', height: '100vh', backgroundColor: '#f0f2f5' }} siderPosition="left">
      <Sider style={{ backgroundColor: '#f0f2f5' }} resizable={false}>
        1
      </Sider>
      <Content style={{ backgroundColor: '#fff' }}>2</Content>
    </Layout>
  );
};
