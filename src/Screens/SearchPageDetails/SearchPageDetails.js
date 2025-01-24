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

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css'; // Or any other theme

function SearchPageDetails() {

const [getPageData, setPageData] = useState([]);
const [getBoardmember, setBoardmember] = useState([]);
// const [getFormattedDate, setFormattedDate] = useState([]);
const [loading, setLoading] = useState(true);
const location = useLocation();
const searchID = location.state || {};

const dataFunc = (date_Value)=>{
const date = new Date(date_Value);
// Format the date and time
return date.toLocaleDateString();
}
const [useData, setSetData] = useState([{
        "transaction_date": "2024-12-03T18:30:00.000Z",
        "credit_amt": 5300,
        "group_code": 1202364549,
        "tot_emi": "5300.00",
        "created_code": "10228",
        "group_name": "MONDAY",
        "created_by": "BABAI DAS",
        "outstanding": 98050,
        "id": 1,
      }, 
      {
        "transaction_date": "2024-12-03T18:30:00.000Z",
        "credit_amt": 5300,
        "group_code": 12023649,
        "tot_emi": "5300.00",
        "created_code": "10228",
        "group_name": "MONDAY",
        "created_by": "BABAI DAS",
        "outstanding": 98050,
        "id": 2,
      }])




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

      if(res.status == '200'){
        console.log(res?.data?.msg[0], 'ffffffff', res.data.suc);
        
        if(res.data.suc > 0){

            setPageData(res?.data?.msg[0])
            setBoardmember(res?.data?.board_member)
            // setFormattedDate(getPageData.reg_date)
            console.log(res?.data, 'kkkkkkkkrrrrrrrrrrrrrrk');
            
            setLoading(false)

        } else {
          setPageData([0])
          // pageDataCheck = res.data.status;
        }
  
        }

    })  


}, [searchID])


const exportToExcel = () => {
    const data = [
        { 'Label': 'Society Name', 'Value': getPageData.cop_soc_name || '--' },
        { 'Label': 'Registration Number', 'Value': getPageData.reg_no || '--' },
        { 'Label': 'Date of Registration', 'Value': getPageData.reg_date ? dataFunc(getPageData.reg_date) : '--' },
        { 'Label': 'Type of Society', 'Value': getPageData.soc_type_name || '--' },
        { 'Label': 'Tier of Society', 'Value': getPageData.soc_tier_name || '--' },
        { 'Label': 'Registration & Controlling Authority', 'Value': getPageData.reg_cont_auth || '--' },
        { 'Label': 'Returning Officer of Society', 'Value': getPageData.returning_officer || '--' },
        { 'Label': 'State', 'Value': getPageData.state_name || '--' },
        { 'Label': 'District', 'Value': getPageData.dist_name || '--' },
        { 'Label': 'Zone', 'Value': getPageData.zone_name || '--' },
        { 'Label': 'Range', 'Value': getPageData.range_name || '--' },
        { 'Label': 'Mapping', 'Value': getPageData.urban_rural_flag == "U" ? 'Urban Mapping' : 'Rural Mapping' },


        // { 'Label': 'Block', 'Value': getPageData.block_name || '--' },
        // { 'Label': 'Gram Panchayat', 'Value': getPageData.gp_name || '--' },
        // { 'Label': 'Village', 'Value': getPageData.vill_name || '--' },
        // { 'Label': 'Pin Code', 'Value': getPageData.pin_no || '--' },

        // { 'Label': 'Category of Urban Local Body', 'Value': getPageData.ulb_catg_name || '--' },
        // { 'Label': 'Urban Local Body', 'Value': getPageData.ulb_name || '--' },
        // { 'Label': 'Locality or Ward', 'Value': getPageData.ward_name || '--' },

        // Conditionally show Urban or Rural fields
        ...(getPageData.urban_rural_flag === "R" ? [
            { 'Label': 'Block', 'Value': getPageData.block_name || '--' },
            { 'Label': 'Gram Panchayat', 'Value': getPageData.gp_name || '--' },
            { 'Label': 'Village', 'Value': getPageData.vill_name || '--' },
            { 'Label': 'Pin Code', 'Value': getPageData.pin_no == null ? "--" : getPageData.pin_no}
        ] : [
            { 'Label': 'Category of Urban Local Body', 'Value': getPageData.ulb_catg_name || '--' },
            { 'Label': 'Urban Local Body', 'Value': getPageData.ulb_name || '--' },
            { 'Label': 'Locality or Ward', 'Value': getPageData.ward_name || '--' },
            { 'Label': 'Pin Code', 'Value': getPageData.pin_no || '--' }
        ]),


        { 'Label': 'Address', 'Value': getPageData.address || '--' },
        { 'Label': 'Management Status', 'Value': getPageData.manage_status_name || '--' },
        { 'Label': 'Type of Special Officer', 'Value': getPageData.officer_type_name || '--' },
        { 'Label': 'Number Of Members', 'Value': getPageData.num_of_memb || '--' },
        { 'Label': 'Audit Completed upto', 'Value': getPageData.audit_upto || '--' },
        { 'Label': 'Last Election of BOD held on', 'Value': getPageData.last_elec_date ? dataFunc(getPageData.last_elec_date) : '--' },
        { 'Label': 'Tenure Ends On', 'Value': getPageData.tenure_ends_on ? dataFunc(getPageData.tenure_ends_on) : '--' },
        { 'Label': 'Name of Key Person', 'Value': getPageData.key_person || '--' },
        { 'Label': 'Designation of Key Person', 'Value': getPageData.key_person_desig || '--' },
        { 'Label': 'Contact Number', 'Value': getPageData.contact_number || '--' },
        { 'Label': 'Email', 'Value': getPageData.email || '--' },
        { 'Label': 'Case Involved', 'Value': getPageData.case_id == 1 ? 'Yes' : 'No' },
        { 'Label': 'Case Number', 'Value': getPageData.case_num || '--' },
        { 'Label': 'Status', 'Value': getPageData.functional_status || '--' }
    ];

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Society Details Data');

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Society_Details_Data.xlsx');
};

  return (
    <>

<div className="wrapper">
    <div className="inner_page_Sec">
    <div className="col-sm-8 float-left left_sec searchPageTop">
      <h1>Details Of {getPageData.cop_soc_name} <button onClick={exportToExcel} className='excelDownload'><img src={`${excel}`} alt="" /></button></h1>

      
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


{getBoardmember.length > 0 && (
    <div className="row">
    <div className="col-md-12">
    <div className="form-group member_list">
    <label className='title'>Board Member List</label>
    <DataTable value={getBoardmember?.map((item, i) => ([{ ...item, id: i }])).flat()} responsiveLayout="scroll">
    <Column header="Sl No." body={(rowData) => <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>}></Column>
    
    <Column field="board_memb_name" header="Name" 
    // sortable
    ></Column>

    <Column field="board_memb_desig" header="Designation" 
    // sortable
    ></Column>

    <Column field="board_memb_email" header="Email"  body={(rowData) => rowData.board_memb_email == null ? '--' : rowData.board_memb_email}
    // sortable
    ></Column>

    </DataTable>
    </div>
    </div>

</div>
)}









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

export default SearchPageDetails