import React from 'react';
import type { Meta } from '@storybook/react';
import { Button, Card, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { saveAsXlsx, saveAsZip } from '../src';

const meta = {
  title: 'Utils/antd table to xlsx',
  decorators: [(story: Function) => <Card>{story()}</Card>],
} satisfies Meta;

export default meta;

interface DataType1 {
  key: React.Key;
  name: string;
  chinese: number;
  math: number;
  english: number;
}

const columns1: TableColumnsType<DataType1> = [
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

const data1: DataType1[] = [
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
      columns: columns1,
      dataSource: data1,
      filename: 'test.xlsx',
    });
  };

  return (
    <div>
      <Button style={{ marginBlock: 10 }} onClick={handleClick}>
        下载
      </Button>
      <Table size="small" columns={columns1} dataSource={data1} />
    </div>
  );
};

interface DataType2 {
  key: React.Key;
  name: string;
  age: number;
  street: string;
  building: string;
  number: number;
  companyAddress: string;
  companyName: string;
  gender: string;
}

const columns2: TableColumnsType<DataType2> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'John',
        value: 'John',
      },
    ],
    onFilter: (value, record) => record.name.indexOf(value as string) === 0,
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Address',
        children: [
          {
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 150,
          },
          {
            title: 'Block',
            children: [
              {
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
              },
              {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
  },
];

const data2: DataType2[] = [];
for (let i = 0; i < 100; i++) {
  data2.push({
    key: i,
    name: 'John Brown',
    age: i + 1,
    street: 'Lake Park',
    building: 'C',
    number: 2035,
    companyAddress: 'Lake Street 42',
    companyName: 'SoftLake Co',
    gender: 'M',
  });
}
export const GroupTable: React.FC = () => {
  const handleClick = () => {
    saveAsXlsx({
      columns: columns1,
      dataSource: data1,
      filename: 'test.xlsx',
    });
  };

  return (
    <div>
      <Button style={{ marginBlock: 10 }} onClick={handleClick}>
        下载
      </Button>
      <Table size="small" columns={columns2} dataSource={data2} />
    </div>
  );
};

export const MultipleTable: React.FC = () => {
  const handleClick = () => {
    saveAsZip({
      filename: '未命名',
      items: [
        {
          filename: '未命名1',
          columns: columns1,
          dataSource: data1,
        },
        {
          filename: '未命名2',
          columns: columns2,
          dataSource: data2,
        },
      ],
    });
  };

  return (
    <div>
      <Button style={{ marginBlock: 10 }} onClick={handleClick}>
        下载
      </Button>
      <Table size="small" columns={columns1} dataSource={data1} />
      <Table size="small" columns={columns2} dataSource={data2} />
    </div>
  );
};
