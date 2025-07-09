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

    // const [visibleImages, setVisibleImages] = useState([]); // For displayed images
    // const [allImages, setAllImages] = useState([]);         // For all fetched images
    // const [loadIndex, setLoadIndex] = useState(0);          // Tracks how many batches are loaded
    // const batchSize = 16; 

    const [visibleImages, setVisibleImages] = useState([]);
    const [allImages, setAllImages] = useState([]);
    const [loadIndex, setLoadIndex] = useState(0);

    const INITIAL_LOAD = 16;
    const LOAD_MORE_COUNT = 8;

    





    // const galleryData_Call = async ()=>{
    //   await GalleryData_Async().then((res)=>{
      
    //   if(res.suc > 0){
    //   var array__ = res?.msg.reverse()
    //   console.log(res?.msg, 'gallery______________');
    //   setGalleryImage(array__);
    //   setGalleryFolder(res?.folder);
    //   setPageTitle(res?.title);
    //   setLoading(false);
    //   } else {
    //   setGalleryImage([])
    
    //   }
    
    //   }).catch((error)=>{
      
    //   console.log(error);
    
    //   })
    
    
    //   } 


  const galleryData_Call = async () => {
  try {
    const res = await GalleryData_Async();
    if (res.suc > 0) {
      const reversed = res.msg.reverse();
      setAllImages(reversed);
      setGalleryFolder(res.folder);
      setPageTitle(res.title);
      setLoading(false);

      setLoadIndex(1); // 1 chunk means 10 initially
      setVisibleImages(reversed.slice(0, INITIAL_LOAD));
    } else {
      setAllImages([]);
      setVisibleImages([]);
    }
  } catch (error) {
    console.log(error);
  }
};



    const onDownload = () => {
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
  

  const handleLoadMore = () => {
  const nextIndex = loadIndex + 1;
  const newCount = INITIAL_LOAD + (nextIndex - 1) * LOAD_MORE_COUNT;
  const newImages = allImages.slice(0, newCount);
  setVisibleImages(newImages);
  setLoadIndex(nextIndex);
  };

    
  
     useEffect(()=>{
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
      
      {/* {getGalleryImage.map((item) => ( */}
      {visibleImages.map((item) => (
        <div className='gal_thum'>
        <Image key={item.gal_img} src={`${BASE_URL}/${getGalleryFolder}/${item.gal_img}`} width={200} />
        </div>
     


      ))}
    </Image.PreviewGroup>

{visibleImages.length < allImages.length && (
  <div className='loadMoreButton_wrap'>
    <button className="btn btn-primary" onClick={handleLoadMore}>Load More</button>
  </div>
)}
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