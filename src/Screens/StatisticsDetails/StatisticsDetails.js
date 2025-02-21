import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useNavigate } from "react-router-dom";
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';
import axios from 'axios';
import { Flex, Spin } from 'antd';
import Loader from '../../Components/Loader';
import excel from "../../Assets/images/excel.png";

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BASE_URL } from '../../routes/config';
import FooterCus from '../../Components/FooterCus';

function StatisticsDetails() {

  const [getPageData, setPageData] = useState([]);
  // const [getFormattedDate, setFormattedDate] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchID = location.state || {};
  
  
  const dataFunc = (date_Value)=>{
  console.log(date_Value, 'date_Valuedate_Valuedate_Value');
  
  const date = new Date(date_Value);
  
  // Format the date and time
  return date.toLocaleDateString();
  
  }
  
  
  
  
  useEffect(()=>{
  
  
  if(searchID)
  
      // console.log(searchID, 'searchData');
      
      
    axios.post(`${BASE_URL}/wapi/getsocdetail`,
      {
        auth_key:"xxxxx",
        soc_id: searchID
      }
      ,
    {
        headers: {
            auth_key: 'c299cf0ae55ac8a2e3932b65fe5f08538962c5114b0f7d5680db8193eb2d3116',
        },
    }
      ).then(res => {

        console.log({
            auth_key:"xxxxx",
            soc_id: searchID
          }, 'kkkkkkkkk');
        
  
        if(res.status == '200'){
          console.log(res, 'ffffffff', res.data.suc);
          
          if(res.data.suc > 0){
  
              setPageData(res?.data?.msg[0])
              // setFormattedDate(getPageData.reg_date)
              console.log(res?.data?.msg[0], 'kkkkkkkkk');
              
              setLoading(false)
  
          } else {
            setPageData([0])
            // pageDataCheck = res.data.status;
          }
    
          }
  
      })  
  
  
  }, [searchID])
  
  
  
  

  return (
    <>

<div className="wrapper">
    <div className="inner_page_Sec">
    <div className="col-sm-8 float-left left_sec searchPageTop">
      <h1>Details Of {getPageData.cop_soc_name} 
        {/* <button onClick={exportToExcel} className='excelDownload'><img src={`${excel}`} alt="" /></button> */}
        </h1>

      
      {loading ? (
        <Loader align = {'center'} gap = {'middle'} size = {'large'} /> // Show Loader while data is loading
      ) : (
        <div className="card">
    <div className="card-body searchDetails">

    <div className="row">
    <div className='col-md-12'>
        <label className='title'>Society Name:</label>
        <label>{getPageData.cop_soc_name == null ? "--" : getPageData.cop_soc_name} </label>
    </div>
    
    </div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Registration Number:  </label>
        <label>{getPageData.reg_no == null ? "--" : getPageData.reg_no}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Date of Registration:   </label>
        <label> {getPageData.reg_date == null ? "--" : dataFunc(getPageData.reg_date)} </label>
    </div>
    </div>
</div>


<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Type of the Society:  </label>
        <label>{getPageData.soc_type_name == null ? "--" : getPageData.soc_type_name}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Tier of the Society:   </label>
        <label>{getPageData.soc_tier_name == null ? "--" : getPageData.soc_tier_name}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Registration & Controlling Authority  </label>
        <label>{getPageData.reg_cont_auth == null ? "--" : getPageData.reg_cont_auth}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Returning Officer of Society   </label>
        <label>{getPageData.returning_officer == null ? "--" : getPageData.returning_officer}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>State  </label>
        <label>{getPageData.state_name == null ? "--" : getPageData.state_name}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>District   </label>
        <label>{getPageData.dist_name == null ? "--" : getPageData.dist_name}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Zone  </label>
        <label>{getPageData.zone_name == null ? "--" : getPageData.zone_name}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Range    </label>
        <label>{getPageData.range_name == null ? "--" : getPageData.range_name}</label>
    </div>
    </div>
</div>


<div className='rural_urban mb-3'>

<div className="row">
    <div className="col-md-6">
    
        <label className='title'>Maping: {getPageData.urban_rural_flag == "U" ? "Urban Maping" : "Rural Maping"}   </label>
        {/* <label>{getPageData.urban_rural_flag == "U" ? "Urban Maping" : "Rural Maping"}</label> */}
    
    </div>
</div>

{getPageData.urban_rural_flag === "R" ? (
        <>
          {/* Content to display if urban_rural_flag is "U" */}
          
        <div className="row">
        <div className="col-md-6">
        
        <label className='title'>Block</label>
        <label>{getPageData.block_name == null ? "--" : getPageData.block_name} </label>
        
        </div>
        <div className="col-md-6">
        
        <label className='title'>Gram Panchayat</label>
        <label>{getPageData.gp_name == null ? "--" : getPageData.gp_name} </label>
        
        </div>

        <div className="col-md-6">
        
        <label className='title'>Village </label>
        <label>{getPageData.vill_name == null ? "--" : getPageData.vill_name}</label>
        
        </div>
        <div className="col-md-6">
        
        <label className='title'>Pin Code    </label>
        <label>{getPageData.pin_no == null ? "--" : getPageData.pin_no}</label>
        
        </div>

        </div>
        </>
      ) : (
        <div>

        <div className="row">
        <div className="col-md-6">
        
        <label className='title'>Category of Urban Local Body</label>
        <label>{getPageData.ulb_catg_name == null ? "--" : getPageData.ulb_catg_name}</label>
        
        </div>
        <div className="col-md-6">
        
        <label className='title'>Urban Local Body </label>
        <label>{getPageData.ulb_name == null ? "--" : getPageData.ulb_name} </label>
        
        </div>

        <div className="col-md-6">
        
        <label className='title'>Locality or Ward </label>
        <label>{getPageData.ward_name == null ? "--" : getPageData.ward_name}</label>
        
        </div>
        <div className="col-md-6">
        
        <label className='title'>Pin Code    </label>
        <label>{getPageData.pin_no == null ? "--" : getPageData.pin_no}</label>
        
        </div>

        </div>
        </div>
      )}

    
</div>

<div className="row">
    <div className="col-md-12">
    <div className="form-group">
        <label className='title'>Address   </label>
        <label>{getPageData.address == null ? "--" : getPageData.address} </label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Management Status   </label>
        <label> {getPageData.manage_status_name == null ? "--" : getPageData.manage_status_name} </label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Type of Special Officer    </label>
        <label>{getPageData.officer_type_name == null ? "--" : getPageData.officer_type_name}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Number Of Member   </label>
        <label>{getPageData.num_of_memb == null ? "--" : getPageData.num_of_memb}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Audit Completed upto     </label>
        <label> {getPageData.audit_upto == null ? "--" : getPageData.audit_upto}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Last election of BOD held on    </label>
        <label> {getPageData.last_elec_date == null ? "--" : dataFunc(getPageData.last_elec_date)}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Tenure Ends On    </label>
        <label>{getPageData.tenure_ends_on == null ? "--" : dataFunc(getPageData.tenure_ends_on)}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Name of the Key Person of the Society </label>
        <label>{getPageData.key_person == null ? "--" : getPageData.key_person}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Designation of the Key Person    </label>
        <label>{getPageData.key_person_desig == null ? "--" : getPageData.key_person_desig}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Contact Number of the Key Person </label>
        <label>{getPageData.contact_number == null ? "--" : getPageData.contact_number}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Email </label>
        <label>{getPageData.email == null ? "--" : getPageData.email}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Any Case Involved regarding election matter (At CEC/HHC/HSC etc.)  </label>
        <label>{getPageData.case_id == 1 ? "Yes" : ''} {getPageData.case_id == 2 ? "No" : ''} {getPageData.case_id == 0 ? "No" : ''}</label>
    </div>
    </div>
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Case Number </label>
        <label>{getPageData.case_num == null ? "--" : getPageData.case_num}</label>
    </div>
    </div>
</div>

<div className="row">
    <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Status</label>
        <label><span className={getPageData.functional_status === 'Functional' ? 'green_Fnc' : 'red_Fnc'}> {getPageData.functional_status == null ? "--" : getPageData.functional_status} </span></label>

        
    </div>
    </div>
    {/* <div className="col-md-6">
    <div className="form-group">
        <label className='title'>Email </label>
        <label>xxxxxxxxxxxxxx</label>
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
    <FooterCus/>
    {/* <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} /> */}
    </>
  )
}

export default StatisticsDetails