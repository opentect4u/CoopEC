
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useLocation, useParams, useNavigate } from "react-router-dom";
// import RightSidebarGlobal from './RightSidebarGlobal';
// import FooterCus from './FooterCus';
import FooterCus from '../../Components/FooterCus';
// import SearchBox from './Components/SearchBox';


// import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import SearchBox from '../../Components/SearchBox';
import pdf from "../../Assets/images/pdf.png";
import Loader from '../../Components/Loader';
import excel from "../../Assets/images/excel.png";

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


function SearchPage() {

const location = useLocation();
const [getPageData, setPageData] = useState([]);
const [getDistrictList, setDistrictList] = useState([]);
const [getRangeList, setRangeList] = useState([]);
const [loading, setLoading] = useState(true);
// const [getPageDataNotFound, setPageDataNotFound] = useState('');

const [searchText, setSearchText] = useState('');
const [searchedColumn, setSearchedColumn] = useState('');
const searchInput = useRef(null);
const [getFormattedDate, setFormattedDate] = useState([]);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const filteredData = getPageData.filter(record => 
    record.cop_soc_name
  );
  

  const columns = [
    {
    title: 'Sl.No.',
    dataIndex: 'index',
    key: 'index',
    width: '3%',
    render: (text, record, index) => index + 1, // Serial number starts from 1
    },
    {
    title: 'Society Name',
    dataIndex: 'cop_soc_name',
    key: 'cop_soc_name',
    width: '22%',
    ...getColumnSearchProps('cop_soc_name'), // Add search functionality here
    sorter: (a, b) => a.cop_soc_name.length - b.cop_soc_name.length,
    sortDirections: ['descend', 'ascend'],
    render: (text, record) => (
    <>
    <span className="address_td">{record.cop_soc_name == null ? "--" : record.cop_soc_name} </span>{' '}
    <span className={record.functional_status === 'Functional' ? 'green_Fnc' : 'red_Fnc'}>
    {record.functional_status == null ? "--" : record.functional_status}
    </span>
    </>
    ),
    },
    {
      title: 'Last Election Date',
      dataIndex: 'last_elec_date',
      key: 'last_elec_date',
      width: '15%',
      // ...getColumnSearchProps('last_elec_date'),
      // render: (text, record) => `${record.last_elec_date}`,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : '--',
      
    },
    {
      title: 'Tenure Ends On',
      dataIndex: 'tenure_ends_on',
      key: 'tenure_ends_on',
      width: '15%',
      // ...getColumnSearchProps('tenure_ends_on'),
      // render: (text, record) => `${record.tenure_ends_on}`,
      render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : '--',
    },
    {
      title: 'Name & Designation',
      dataIndex: 'contact_name',
      key: 'contact_name',
      width: '15%',
      // ...getColumnSearchProps('contact_name'),
      // render: (text, record) => `${record.contact_name} (${record.contact_designation ? null : 'Not Mention'})` , // Concatenating Name and Designation

      render: (text, record) => (
        <>
          {record.contact_name == null ? "--" : record.contact_name} {record.contact_designation == null ? '' : '('+record.contact_designation+')'}
        </>
      ),
    },
    {
      title: 'Contact Number & Email',
      dataIndex: 'contact_number',
      key: 'contact_number',
      width: '20%',
      // ...getColumnSearchProps('contact_number'),
      render: (text, record) => (
        <>
          <span className="contact_Num_td">{record.contact_number == null ? "--" : record.contact_number}</span>  <span className="email_ID_td">{record.email}</span>
          {/* <span className="email_ID_td">{record.email.length < 1 ? '' : record.email}</span> */}
        </>
      ),
    },
    {
      title: 'View Details',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
     //  ...getColumnSearchProps('document'),
     render: (id) => <button className='viewDetails' onClick={()=>{
      gotoDetails(id)
      // navigation('/searchdetails');
     }}>
       <i class="fa fa-eye" aria-hidden="true"></i> Details</button>,
    }
    // {
    //   title: 'Address',
    //   dataIndex: 'cop_soc_name',
    //   key: 'cop_soc_name',
    //   ...getColumnSearchProps('cop_soc_name'),
    //   sorter: (a, b) => a.cop_soc_name.length - b.cop_soc_name.length,
    //   sortDirections: ['descend', 'ascend'],
    // },
  ];

  const navigation = useNavigate();

  const gotoDetails = (id)=>{
    // alert(id)
    navigation('/searchdetails', { state: id});
  }


// var pageDataCheck;

const searchData = location.state || {};

// const searchDataLength = Object.keys(searchData);

const districtList = async()=>{

  await axios.post('https://admincecwb.opentech4u.co.in/wapi/distlist',
    // {},
    // {
    //     headers: {
    //         Authorization: loginData.token,
    //     },
    // }
    ).then(res => {

    if(res.status == '200'){
    if(res.data.suc > 0){
      setDistrictList(res?.data?.msg)
    }

    }

      
    })  
 }

 const rangeList = async(districValue)=>{

  // console.log(districValue, 'kkkkkkkkkkkkkkkk');
  
  await axios.post('https://admincecwb.opentech4u.co.in/wapi/rangelist',
    {
      auth_key:"xxxxx",
      dist_id: districValue
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
      setRangeList(res?.data?.msg[0].range_name)
      console.log(getRangeList, 'getRangeList', res?.data?.msg[0].range_name);
    }

    }

      
    })  
 }

 const handleDownload = ()=>{

 }

 
 useEffect(()=>{
  districtList();

 
  if(searchData['select_district']!=undefined)

    console.log(searchData, 'searchData');
    
    
  axios.post('https://admincecwb.opentech4u.co.in/wapi/societysearch',
    {
      auth_key:"xxxxx",
      dist_id: searchData.select_district,
      range_code: searchData.select_range,
      soc_type_id: searchData.select_type == '' ? 0 : searchData.select_type,
      socname: searchData.society_Name
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
            setPageData(res?.data?.msg)
            console.log(res.data.msg, 'jjjjjjjjj');

            setLoading(false);
            // pageDataCheck = res.data.status;
        } else {
          setPageData([0])
          // pageDataCheck = res.data.status;
        }
  
        }

    })  


  },[searchData])

 function limitWords(content, wordLimit) {
  const words = content?.split(' ');
  if (words.length > wordLimit) {
  return words.slice(0, wordLimit).join(' ') + '...';
  }
  return content;
  }

  useEffect(()=>{

    rangeList(searchData.select_district);
      
    }, [searchData.select_district])

  // const exportPdfHandler = ()=>{

  //   const doc = new jsPDF();
  //   doc.autoTable({html:'#dataTable_search'})
  //   doc.save('dataTest.pdf')
  //   // alert('sss')
  // }

  const excelData = getPageData.map((item) => ({
    'Society Name': item.cop_soc_name + item.functional_status,              // Change 'name' to 'Full Name'
    'Last Election Date': item.last_elec_date,             // Change 'age' to 'Age (Years)'
    // 'Residential Address': item.address, // Change 'address' to 'Residential Address'
  }));

  const exportPdfHandler = () => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a binary string representing the Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Use file-saver to trigger a download
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'table_data.xlsx');
  };


  return (
    <>
    
    <div className="wrapper">
    <div className="inner_page_Sec">
    <div className='col-sm-12 searchPageTop'>
    <SearchBox district_def_Valu = {searchData.select_district}  range_def_Valu = {searchData.select_range} type_def_Valu = {searchData.select_type} soci_Name_def_Valu = {searchData.society_Name} />
    </div>
    <div className="col-sm-12 left_sec search_data_table">

    <h1 className='search_page'>List of Cooperative Societies in {getRangeList} &nbsp; <strong> ({getPageData.length})</strong>
      {/* <button className='pdfDownload'>Download PDF<i class="fa fa-file-pdf-o" aria-hidden="true"></i></button> */}

      <a onClick={handleDownload} className='excelDownload'><img src={`${excel}`} alt="" /></a>
    </h1>


  {/* {loading ? (
  <Loader align = {'center'} gap = {'middle'} size = {'large'} /> // Show Loader while data is loading
  ) : ( */}
  <button className='export_btn' onClick={exportPdfHandler}>Download PDF</button>
  <Table columns={columns} loading={{ spinning: loading, tip: 'Loading data, please wait...' }} dataSource={filteredData} id='dataTable_search' />
  {/* <Table columns={columns} dataSource={getPageData} /> */}
  {/* )} */}


    District: {searchData.select_district} <br/>
    Range: {searchData.select_range}<br/>
    Type: {searchData.select_type}<br/>
    Society Name: {searchData.society_Name}

    </div>

    </div>
    </div>

    <FooterCus/>
    </>
  )
}

export default SearchPage