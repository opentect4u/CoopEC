import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react'
import DefaultPage from '../../Components/DefaultPage';

function GalleryPage() {

    const [getPageData, setPageData] = useState([]);

    let pageDataStore = [];
  
    const pageContentData = {
        pageTitle: 'Gallery',
        pageContent: getPageData?.body
      }
   
  
    const fetchdata = ()=>{
      return new Promise((resolve, reject) => {
      axios.get('https://jsonplaceholder.typicode.com/posts/1',
      // {},
      // {
      //     headers: {
      //         Authorization: loginData.token,
      //     },
      // }
      ).then(res => {
  
      if(res.status == '200'){
      pageDataStore = res.data
      setPageData(pageDataStore)
      resolve(res.data);
      console.log(pageDataStore.title, 'ddddddd' , res);
      }
      }).then(() =>{
      pageDataStore = []
      }).catch(err => {
      console.log(err);
      reject(err); 
      });
      });
     }
  
    
  
     useEffect(()=>{
      fetchdata();
     },[])

  return (
    <>
      <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} />
    </>
  )
}

export default GalleryPage