import React from 'react';
import type { Meta } from '@storybook/react';
import { Button, Card, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { saveAsXlsx } from '../src';

const meta = {
  title: 'Example/AntdTableToXlsx',
  decorators: [(story: Function) => <Card>{story()}</Card>],
} satisfies Meta;

export default meta;

interface DataType {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Chinese Score',
    dataIndex: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Math Score',
    dataIndex: 'math',
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: 'English Score',
    dataIndex: 'english',
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: '2',
    name: 'Jim Green',
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: '3',
    name: 'Joe Black',
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: '4',
    name: 'Jim Red',
    chinese: 88,
    math: 99,
    english: 89,
  },
];

export const NormalTable: React.FC = () => {
  const handleClick = () => {
    saveAsXlsx({
      columns: columns,
      dataSource: data,
      filename: 'test.xlsx',
    });
  };

  return (
    <div>
      <Button style={{ marginBlock: 10 }} onClick={handleClick}>
        下载
      </Button>
      <Table size="small" columns={columns} dataSource={data} />
    </div>
  );
};
