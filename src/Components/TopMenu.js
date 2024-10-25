import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import  { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function TopMenu() {

// type MenuItem = Required<MenuProps>['items'][number];
const navigate = useNavigate();

const items = [
  {
    label: 'Home',
    // label: <Link to={"/about"}>Home</Link>,
    key: '/',
    // icon: <MailOutlined />,
  },
  {
    label: 'About Us',
    key: '/about',
    
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'About Us', key: '/about'},
    // { label: 'Option 1', key: 'setting_1:1'},
    // { label: 'Option 2', key: 'setting_1:2' }
    // ],
  },
  {
    label: 'Act & Rules ',
    key: '/actRules',
  },
  {
    label: 'Announcement',
    key: '/importantannouncement',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Important Announcement', key: '/importantannouncement' },  
    // { label: 'Option 1', key: 'setting_3:1' },
    // { label: 'Option 1', key: 'setting_3:2' }
    // ],
  },
  {
    label: 'Notifications & Orders',
    key: '/notificationsorders',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Option 1', key: 'setting_4:1' },
    // { label: 'Option 1', key: 'setting_4:2' }
    // ],
  },
  {
    label: 'Tenders ',
    key: '/tenders',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Option 1', key: 'setting_5:1' },
    // { label: 'Option 1', key: 'setting_5:2' }
    // ],
  },
  {
    label: 'FAQ ',
    key: '/faq',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Option 1', key: 'setting_5:1' },
    // { label: 'Option 1', key: 'setting_5:2' }
    // ],
  },
  {
    label: 'Downloads  ',
    key: '/downloads',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Downloads', key: 'downloads' },  
    // { label: 'Option 1', key: 'setting_6:1' },
    // { label: 'Option 1', key: 'setting_6:2' }
    // ],
  },
  {
    label: 'Gallery',
    key: '/gallery',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Option 1', key: 'setting_7:1' },
    // { label: 'Option 1', key: 'setting_7:2' }
    // ],
  },
  {
    label: 'Contact Us',
    key: '/contact-us',
    // icon: <SettingOutlined />,
    // children: [
    // { label: 'Option 1', key: 'setting_8:1' },
    // { label: 'Option 1', key: 'setting_8:2' }
    // ],
  },
  {
    label: 'Important Links',
    key: '/importantLinks',
  },
  {
    label: 'Statistics',
    key: '/statistics',
  },
  // {
  //   label: 'Test',
  //   key: '/test',
  // },
  // {
  //   label: 'Map',
  //   key: '/map',
  // }
//   {
//     label: 'Navigation Two',
//     key: 'app',
//     icon: <AppstoreOutlined />,
//     // disabled: true,
//   },
//   {
//     label: 'Navigation Three - Submenu',
//     key: 'SubMenu',
//     icon: <SettingOutlined />,
//     children: [
//       {
//         type: 'group',
//         label: 'Item 1',
//         children: [
//           { label: 'Option 1', key: 'setting:1' },
//           { label: 'Option 2', key: 'setting:2' },
//         ],
//       },
//       {
//         type: 'group',
//         label: 'Item 2',
//         children: [
//           { label: 'Option 3', key: 'setting:3' },
//           { label: 'Option 4', key: 'setting:4' },
//         ],
//       },
//     ],
//   },
//   {
//     key: 'alipay',
//     label: (
//       <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
//         Navigation Four - Link
//       </a>
//     ),
//   },
];

const [current, setCurrent] = useState('home');
  
    const onClick = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
      navigate(e.key); // Navigate to the clicked route
    };

  return (
    
    <><Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} /></>
  )
}

export default TopMenu