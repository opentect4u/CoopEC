import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react'
import DefaultPage from '../../Components/DefaultPage';
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';

import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, Space } from 'antd';
import { BASE_URL } from '../../routes/config';
import FooterCus from '../../Components/FooterCus';
import Loader from '../../Components/Loader';
import useGalleryData from '../../Hooks/API/GalleryData';

const imageList = [
  'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
];


function GalleryPage() {


    const [current, setCurrent] = React.useState(0);
    const [getGalleryImage, setGalleryImage] = useState([]);
    const [getGalleryFolder, setGalleryFolder] = useState('');
    const [getPageTitle, setPageTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const { GalleryData_Async } = useGalleryData()



    const fetchdata = ()=>{
  
      axios.post(`${BASE_URL}/wapi/gallimglist`,
     {
       auth_key:"xxxxx",
     }
     // ,
     // {
     //     headers: {
     //         Authorization: loginData.token,
     //     },
     // }
     ).then(res => {
 
       if(res.status == '200'){
         
         if(res.data.suc > 0){
          setGalleryImage(res?.data?.msg);
          setGalleryFolder(res?.data?.folder);
          setPageTitle(res?.data?.title);
          setLoading(false);
             // setFolderLocation()
             console.log(res , 'gggggggg', res?.data?.msg);
 
             // pageDataCheck = res.data.status;
         } else {
          setGalleryImage([])
           // pageDataCheck = res.data.status;
         }
   
         }
 
     }) 
 
    }

    // const galleryData_Call = async ()=>{
    //   await GalleryData_Async().then((res)=>{
    //   setGalleryImage(res?.msg);
    //   setGalleryFolder(res?.folder);
    //   setPageTitle(res?.title);
    //   setLoading(false);
    
    //   }).catch((error)=>{
    //   setGalleryImage([])
    //   console.log(error);
    
    //   })
    
    
    //   } 

    const galleryData_Call = async ()=>{
      await GalleryData_Async().then((res)=>{
      
      if(res.suc > 0){
      setGalleryImage(res?.msg);
      setGalleryFolder(res?.folder);
      setPageTitle(res?.title);
      setLoading(false);
      } else {
      setGalleryImage([])
    
      }
    
      }).catch((error)=>{
      
      console.log(error);
    
      })
    
    
      } 

    const onDownload = () => {
      // const url = getGalleryImage[current];
      const currentImageObj = getGalleryImage[current];
      const url = `${BASE_URL}/${getGalleryFolder}/${currentImageObj.gal_img}`;
      const suffix = url.slice(url.lastIndexOf('.'));
      const filename = Date.now() + suffix;

      
      
  
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          console.log(url, 'jjjjjjjjjjj');
          const blobUrl = URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(blobUrl);
          link.remove();
        });
    };
  
    
  
     useEffect(()=>{
      // fetchdata();
      galleryData_Call();
     },[])

  return (
    <>

<div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec searchPageTop">

    {loading ?(
      <Loader align = {'center'} gap = {'middle'} size = {'large'} />
    ):(
      <>
    <h1>{getPageTitle}</h1>
    
    <div className='thumbnail_image_sec row'>
    <Image.PreviewGroup
      preview={{
        toolbarRender: (
          _,
          {
            transform: { scale },
            actions: {
              onActive,
              onFlipY,
              onFlipX,
              onRotateLeft,
              onRotateRight,
              onZoomOut,
              onZoomIn,
              onReset,
            },
          },
        ) => (
          <Space size={12} className="toolbar-wrapper">
            {/* <LeftOutlined onClick={() => onActive?.(-1)} />
            <RightOutlined onClick={() => onActive?.(1)} /> */}
            <DownloadOutlined onClick={onDownload} />
            <SwapOutlined rotate={90} onClick={onFlipY} />
            <SwapOutlined onClick={onFlipX} />
            <RotateLeftOutlined onClick={onRotateLeft} />
            <RotateRightOutlined onClick={onRotateRight} />
            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
            <UndoOutlined onClick={onReset} />
          </Space>
        ),
        onChange: (index) => {
          setCurrent(index);
          console.log(index, 'indexindexindexindex');
          
        },
      }}
    >
      
      {getGalleryImage.map((item) => (
        <div className='gal_thum'>
        <Image key={item.gal_img} src={`${BASE_URL}/${getGalleryFolder}/${item.gal_img}`} width={200} />
        {/* <Image key={item} src={item} width={200} /> */}
        </div>
     


      ))}
    </Image.PreviewGroup>

    </div>
      </>
    )}


    

    </div>
    <div class="col-sm-4 float-left">
    <RightSidebarGlobal/>
    </div>

    </div>
    </div>

      {/* <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} /> */}

      <FooterCus/>

    </>
  )
}

export default GalleryPage