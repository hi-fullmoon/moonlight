import React from 'react';
import Demo1 from './components/demo1';
import Demo2 from './components/demo2';
import { Divider } from 'antd';

const App: React.FC = () => {
  return (
    <div>
      <Demo1 />
      <Divider />
      <Demo2 />
    </div>
  );
};

export default App;
