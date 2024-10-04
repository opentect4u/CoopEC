
import React from 'react'
import { useLocation, useParams } from "react-router-dom";
import RightSidebarGlobal from './RightSidebarGlobal';
import FooterCus from './FooterCus';

function SearchPage() {

const location = useLocation();
// const params=useParams()
// Extract query params from the URL
// const queryParams = new URLSearchParams(location.search);
// const district = queryParams.get("select_district");

const searchData = location.state || {};

console.log('hhhhhh', searchData);


  return (
    <>
    <div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-12 float-left left_sec">
    <h2>Search Page Data</h2>
    District: {searchData.select_district} <br/>
    Range: {searchData.select_range}<br/>
    Type: {searchData.select_type}<br/>
    Society Name: {searchData.society_Name}

    </div>

    {/* <div class="col-sm-4 float-left">
      <RightSidebarGlobal/>
    </div> */}

    </div>
    </div>

    <FooterCus/>
    </>
  )
}

export default SearchPage