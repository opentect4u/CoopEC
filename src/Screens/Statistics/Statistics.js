import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useLocation, useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
// import RightSidebarGlobal from './RightSidebarGlobal';
// import FooterCus from './FooterCus';
import FooterCus from '../../Components/FooterCus';
// import SearchBox from './Components/SearchBox';


// import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { Radio } from 'antd';

import SearchBox from '../../Components/SearchBox';
import pdf from "../../Assets/images/pdf.png";
import Loader from '../../Components/Loader';
import excel from "../../Assets/images/excel.png";

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BASE_URL } from '../../routes/config';

function Statistics() {

    const location = useLocation();
    const [getPageData, setPageData] = useState([]);
    const [getDistrictList, setDistrictList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [getFormattedDate, setFormattedDate] = useState([]);
    const [selectedOption, setSelectedOption] = useState(1);
    
    
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
        <span className="address_td">{record.range_name == null ? "--" : record.range_name} </span>
        <span className={record.functional_status === 'Functional' ? 'green_Fnc' : 'red_Fnc'}>
        {record.functional_status == null ? "--" : record.functional_status}
        </span>
        </>
        ),
        },
        {
          title: 'Society Type',
          dataIndex: 'soc_type_name',
          key: 'soc_type_name',
          width: '15%',
          render: (text, record) => (
            <>
              {record.soc_type_name == null ? "--" : record.soc_type_name}
            </>
          ),
        },
        {
          title: 'Last Election Date',
          dataIndex: 'last_elec_date',
          key: 'last_elec_date',
          width: '13%',
          render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : '--',
          
        },
        {
          title: 'Tenure Ends On',
          dataIndex: 'tenure_ends_on',
          key: 'tenure_ends_on',
          width: '13%',
          render: (date) => date ? new Date(date).toLocaleDateString('en-GB') : '--',
        },
        {
          title: 'Key Person Details',
          dataIndex: 'contact_name',
          key: 'contact_name',
          width: '19%',
          render: (text, record) => (
            <>
              {record.contact_name == null ? "--" : record.contact_name} {record.contact_designation == null ? '' : '('+record.contact_designation+')'}
              <span className="contact_Num_td">{record.contact_number == null ? "--" : record.contact_number}</span>  <span className="email_ID_td">{record.email}</span>
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
      ];
    
      const navigation = useNavigate();

      const gotoDetails = (id)=>{
        // alert(id)
        navigation('/statistics-details', { state: id});
      }
    
    
    
    
    
     const searchDataFn = (para)=>{
    
      axios.post(`${BASE_URL}/wapi/societyelectionstatus`,
        {
          auth_key:"xxxxx",
          election_status: para,
        }
        // ,
        // {
        //     headers: {
        //         Authorization: loginData.token,
        //     },
        // }
        ).then(res => {
    
          if(res.status == '200'){
            console.log(res, 'ffffffff', res?.data?.msg.length);
            
            if(res.data.suc > 0){
                setPageData(res?.data?.msg)
                console.log(res?.data?.msg, 'jjjjjjjjj');
    
                setLoading(false);
                // pageDataCheck = res.data.status;
            } else {
              setPageData([])
              setLoading(false);
              // pageDataCheck = res.data.status;
            }
      
            }
    
        }) 
    
     }
    
    
    //  useEffect(()=>{
    // //   districtList();
    //   // [searchData]
    //   },[])
    
    
      useEffect(()=>{
    
        searchDataFn('ONGOING');
          
        }, [])



  const handleOptionChange = (e) => {
    const option = e.target.value;
    setSelectedOption(option);

    if (option === 1) {
      console.log('On Going Elections selected');
      searchDataFn('ONGOING');
      // Logic for "On Going Elections"
    } else if (option === 2) {
      console.log('Completed Elections selected');
      searchDataFn('DUE');
      // Logic for "Completed Elections"
    } else if (option === 3) {
      console.log('Due selected');
      searchDataFn('DONE');
      // Logic for "Due"
    }
  };
    
    
      const excelData = getPageData.map((item) => ({
        'Society Name': item.cop_soc_name, 
        'RangeName': item.range_name, 
        'Society Type': item.soc_type_name,  
        'Functional Status': item.functional_status,
        'Last Election Date': item.last_elec_date ? new Date(item.last_elec_date).toLocaleDateString('en-GB') : '--', // Format as DD/MM/YYYY : '--',,
        'Tenure Ends On': item.tenure_ends_on  ? new Date(item.tenure_ends_on).toLocaleDateString('en-GB') : '--',
        'Key Persone Name': item.contact_name,
        'Key Persone Designation': item.contact_designation,
        'Contact Number': item.contact_number,
        'Email': item.email,
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
    
        
        saveAs(blob, 'Cooperative_Societies_search_Data.xlsx');
      };

      
  return (
    <>
    
    <div className="wrapper">
    <div className="inner_page_Sec">
   
    <div className="col-sm-12 left_sec search_data_table">

    <h1 className='search_page'>Statistics Data &nbsp; <strong> ({getPageData.length})</strong>
      <button onClick={exportPdfHandler} className='excelDownload'><img src={`${excel}`} alt="" /></button>
    </h1>

    <div className="radio_Btn__">

    <Radio.Group
      name="radiogroup"
      onChange={handleOptionChange}
      value={selectedOption}
    >
      <Radio value={1}>On Going Elections</Radio>
      <Radio value={2}>Completed Elections</Radio>
      <Radio value={3}>Due</Radio>
    </Radio.Group>

    </div>




  <Table columns={columns} loading={{ spinning: loading, tip: 'Loading data, please wait...' }} dataSource={filteredData} id='dataTable_search' />

    </div>

    </div>
    </div>

    <FooterCus/>
    </>
  )
}

export default Statistics