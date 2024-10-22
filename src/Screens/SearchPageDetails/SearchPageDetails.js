import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from "react-router-dom";
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';
import axios from 'axios';
import { Flex, Spin } from 'antd';
import Loader from '../../Components/Loader';

function SearchPageDetails() {

const [getPageData, setPageData] = useState([]);
const [getFormattedDate, setFormattedDate] = useState([]);
const [loading, setLoading] = useState(true);

const location = useLocation();
const searchID = location.state || {};


// Convert the ISO date string to a JavaScript Date object
const date = new Date(getFormattedDate);

// Format the date and time
const formattedDate = date.toLocaleDateString();  // e.g., "11/15/2000" or based on locale
const formattedTime = date.toLocaleTimeString();  // e.g., "7:30:00 PM" or based on locale


useEffect(()=>{



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
            setFormattedDate(getPageData.reg_date)
            setLoading(false)

        } else {
          setPageData([0])
          // pageDataCheck = res.data.status;
        }
  
        }

    })  


}, [searchID, getFormattedDate])

  return (
    <>

<div className="wrapper">
    <div className="inner_page_Sec">
    <div className="col-sm-8 float-left left_sec searchPageTop">
      <h1>Search Details Of {getPageData.cop_soc_name}</h1>

      
      {loading ? (
        <Loader align = {'center'} gap = {'middle'} size = {'large'} /> // Show Loader while data is loading
      ) : (
        <div className="card">
    <div className="card-body searchDetails">

    <div className="row">
    <div className='col-md-12'>
        <label className='title'>Society Name:</label>
        <label>{getPageData.cop_soc_name} </label>
    </div>
    
    </div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Registration Number:  </label>
        <label>{getPageData.reg_no}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Date of Registration:   </label>
        <label>{formattedDate}</label>
    </div>
    </div>
</div>


<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Type of the Society:  </label>
        <label>{getPageData.soc_type_name}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Tier of the Society:   </label>
        <label>{getPageData.soc_tier_name}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Registration & Controlling Authority  </label>
        <label>{getPageData.reg_cont_auth}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Returning Officer of Society   </label>
        <label>{getPageData.returning_officer}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>State  </label>
        <label>{getPageData.state_name}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>District   </label>
        <label>{getPageData.dist_name}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Zone  </label>
        <label>{getPageData.zone_name}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Range    </label>
        <label>{getPageData.range_name}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Maping   </label>
        <label>{getPageData.urban_rural_flag == "U" ? "Urban Maping" : "Rural Maping"}</label>
    </div>
    </div>
    {/* <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Range    </label>
        <label>{getPageData.range_name}</label>
    </div>
    </div> */}
</div>


    </div>
    </div>
      )}

    
      
     </div>
     <div className="col-sm-4 float-left">
      <RightSidebarGlobal/>
    </div>

    </div>
    </div>

    {/* <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} /> */}
    </>
  )
}

export default SearchPageDetails