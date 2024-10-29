import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import HeaderTop from './Components/HeaderTop';
// import BannerSlider from './Components/BannerSlider';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { ConfigProvider } from 'antd';
// import TestPage from './Screens/TestPage/TestPage';
import {Detector, Online, Offline} from "react-detect-offline"
import NoConnection from './Screens/NoConnection/NoConnection';
import { useEffect } from 'react';

function App() {

  useEffect(()=>{
    }, [])
    
  return (


    

    <>
    
     {/* <PrimeReactProvider> */}
      <ConfigProvider theme={{
      components: {
        Menu: {
          itemBg:'none',
          subMenuItemBg:'#014737',
          subMenuItemBorderRadius:0,
          itemSelectedBg:'#124280',
          popupBg:'#19539e',
          itemColor:'#fff',
          // itemSelectedBg:'#000',
          itemBorderRadius:0,
          itemMarginInline:0,
          itemHoverBg:'#124280',
          itemSelectedColor:'#fff',
          itemHoverColor:'#fff',
          colorPrimary:'#fff',
          lineType:'none',
          dropdownWidth:'220px',
          lineHeight: '44px'
        },
        Tabs:{
          inkBarColor:'#1b64b3',
          itemColor:'#1b64b3',
          itemSelectedColor:'#fff',
          itemHoverColor:'#1b64b3',
          itemActiveColor:'#1b64b3',
          horizontalItemGutter:'10px'
        },
        Collapse:{
          // size:'30'
        }
        // Dropdown:{
        //   colorBgElevated:'white',
        //   colorText:'#014737',
        //   controlItemBgHover:'#D1D5DB'
  
        // },
        // Radio:{
        //   colorPrimary:"#014737",
        //   buttonColor:'#014737',
        //   colorBorder:'#014737'
        // }
      },
    }}>
      {/* <Outlet/> */}
      <HeaderTop/>

    <Online>
      <Outlet />
    </Online>
    <Offline>
      <NoConnection/>
    </Offline>
   
      </ConfigProvider>

      
  {/* </PrimeReactProvider> */}
 
  </>
   
  );
}

export default App;
