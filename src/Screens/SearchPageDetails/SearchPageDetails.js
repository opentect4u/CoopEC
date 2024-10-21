import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from "react-router-dom";
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';
import axios from 'axios';

function SearchPageDetails() {

const [getPageData, setPageData] = useState([]);

const location = useLocation();
const searchID = location.state || {};

useEffect(()=>{

// console.log(searchID, 'searchDatasearchDatasearchData');

if(searchID)

    // console.log(searchID, 'searchData');
    
    
  axios.post('https://admincecwb.opentech4u.co.in/wapi/getsocdetail',
    {
      auth_key:"xxxxx",
      soc_id: searchID
    }
    // ,
    // {
    //     headers: {
    //         Authorization: loginData.token,
    //     },
    // }
    ).then(res => {

      if(res.status == '200'){
        console.log(res, 'ffffffff', res.data.suc);
        
        if(res.data.suc > 0){
            setPageData(res?.data?.msg[0])

            // pageDataCheck = res.data.status;
        } else {
          setPageData([0])
          // pageDataCheck = res.data.status;
        }
  
        }

    })  


}, [searchID])

  return (
    <>

<div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec searchPageTop">
      <h1>Search Details Of <strong>{getPageData.cop_soc_name}</strong> </h1>
      Cooperative Societies Name: {getPageData.cop_soc_name}
     </div>
     <div class="col-sm-4 float-left">
      <RightSidebarGlobal/>
    </div>

    </div>
    </div>

    {/* <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} /> */}
    </>
  )
}

export default SearchPageDetails