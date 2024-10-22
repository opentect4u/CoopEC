import React, { useState } from 'react'
import axios from 'axios'
import { ADDRESSES } from '../routes/addresses'
import { useEffect } from 'react'
import { BASE_URL } from "../routes/config";

function Tenders(
    {
    wordCount
    }
) {

  const [getTenderData, setTenderData] = useState([]);

  const fetchdata = ()=>{

    axios.post(`${BASE_URL}/wapi/getdoclist`,
   {
     auth_key:"xxxxx",
     doc_type: 3
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
        setTenderData(res?.data?.msg);
          //  setPageTitle(res.data.title);
          //  setFolderLocation(res?.data?.folder_name)
           // setFolderLocation()
           console.log(res , 'uuuuuuuuuuuuuuuuuuuuuu', res?.data?.msg);
  
           // pageDataCheck = res.data.status;
       } else {
        //  setPageData([0])
         setTenderData([0])
         // pageDataCheck = res.data.status;
       }
  
       }
  
   }) 
  
  }

   function limitWords(content, wordLimit) {
    const words = content?.split(' ');
    if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
    }




   useEffect(()=>{
    fetchdata();
   },[])

    // const gstSettings = await handleGetGst();

  return (
    <>
    {getTenderData?.map(item=>
    <p>
    {/* {wordCount} */}
    {limitWords(item?.doc_title, wordCount)}
    {/* <span><i className="fa fa-clock-o" aria-hidden="true"></i> {item.email} </span> */}
    </p>
    )}
    </>
  )
}

export default Tenders