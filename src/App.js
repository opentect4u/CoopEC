import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import HeaderTop from './Components/HeaderTop';
// import BannerSlider from './Components/BannerSlider';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { ConfigProvider } from 'antd';

function App() {
  return (


    

    <>
     {/* <PrimeReactProvider> */}
      <ConfigProvider theme={{
      components: {
        // Steps:{
        //   colorPrimary:'#22543d',
        // },
        // Timeline:{
        //   dotBg:'#22543d',
        //   tailColor:'#22543d',
        //   colorPrimary:'#22543d',
        //   },
        // Select: {
        //   colorPrimary: '#22543d',
        //   colorPrimaryHover: '#22543d',
        //   optionActiveBg: '#22543d',
        //   optionSelectedColor:'#000000',
        //   optionSelectedFontWeight: '700',
  
        // },
        // DatePicker:{
        //   activeBorderColor:'#22543d',
        //   hoverBorderColor:'#22543d',
        //   colorPrimary:'#22543d'
        // },
        // Breadcrumb:{separatorColor:'#052d27', itemColor:'#052d27', lastItemColor:'#052d27',fontSize:15},
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
        // Segmented:{
        //   itemActiveBg:'#014737',
        //   itemColor:'#014737',
        //   itemSelectedColor:'white',
        //   itemSelectedBg:'#014737',
          
        // },
        // FloatButton:{
        //   borderRadiusLG:20,
        //   borderRadiusSM:20,
        //   colorPrimary:'#eb8d00',
        //   colorPrimaryHover:'#eb8d00',
        //   margin:30
        // },
        // Switch:{
        //   // colorPrimary:'#025129',
        //   // colorPrimaryHover:'#025129'
  
        //    colorPrimary:'#014737',
        //   colorPrimaryHover:'#014737'
        // },
        // Checkbox:{
        //   colorPrimary:'#014737',
        //   colorText:'#014737',
        //   colorPrimaryHover:'#014737'
        // },
        // Descriptions:{
        //   titleColor:'#014737',
        //   colorTextLabel:'#014737',
        //   colorText:'#014737',
        //   colorSplit:'#014737',
        //   labelBg:'#F1F5F9'
          
        // },
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
   {/* <BannerSlider/> */}
   <Outlet/>
      </ConfigProvider>

      
  {/* </PrimeReactProvider> */}
  </>
   
  );
}

export default App;
