import React from 'react';
import {Header} from "../../components";

const Dashboard = () => {
  return (
    <div className="card">
      <div className={'flex items-start justify-between'}>
        <Header category="Page" title="Dashboard"/>
      </div>
    </div>
  );
};

export default Dashboard;