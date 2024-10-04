// import React from 'react'
import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tabs } from "antd";
import { TabsProps } from 'antd';
import Tenders from './Tenders';
import ImportantLinks from './ImportantLinks';

function TabContentHome() {


    const onChange = (key) => {
      console.log(key);
    };

    const _tender_WordCount= 20;
    const _importantLinks_WordCount = 20;

    const items = [
      {
        key: '1',
        label: 'Tenders',
        children: <marquee className="marq" height="350px" direction="up" scrollamount="4" loop=""><Tenders wordCount={_tender_WordCount}/></marquee>,
      },
      {
        key: '2',
        label: 'Important Links',
        children: <marquee className="marq" height="350px" direction="up" scrollamount="4" loop=""><ImportantLinks wordCount={_importantLinks_WordCount}/></marquee>,
      },
    ];
    
  return (
  <>
  
  <div className="wrapper branch_sec">
  <Tabs className='tabContent' defaultActiveKey="1" items={items} onChange={onChange} />
  </div>

  </>
  )
}

export default TabContentHome