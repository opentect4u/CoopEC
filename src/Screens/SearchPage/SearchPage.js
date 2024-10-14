
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useLocation, useParams } from "react-router-dom";
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




function SearchPage() {

const location = useLocation();
const [getPageData, setPageData] = useState([]);
// const [getPageDataNotFound, setPageDataNotFound] = useState('');

const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
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
  const columns = [
    {
      title: 'Society Name',
      dataIndex: 'cop_soc_name',
      key: 'cop_soc_name',
      // width: '30%',
      ...getColumnSearchProps('cop_soc_name'),
    },
    {
      title: 'Last Election Date',
      dataIndex: 'last_elec_date',
      key: 'last_elec_date',
      // width: '20%',
      ...getColumnSearchProps('last_elec_date'),
    },
    {
      title: 'Tenure Ends On',
      dataIndex: 'tenure_ends_on',
      key: 'tenure_ends_on',
      // width: '20%',
      ...getColumnSearchProps('tenure_ends_on'),
    },
    {
      title: 'Key Person Name',
      dataIndex: 'contact_name',
      key: 'contact_name',
      // width: '20%',
      ...getColumnSearchProps('contact_name'),
    },
    {
      title: 'Key Person Designation',
      dataIndex: 'contact_designation',
      key: 'contact_designation',
      // width: '20%',
      ...getColumnSearchProps('contact_designation'),
    },
    {
      title: 'Key Person Contact Number',
      dataIndex: 'contact_number',
      key: 'contact_number',
      // width: '20%',
      ...getColumnSearchProps('contact_number'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // width: '20%',
      ...getColumnSearchProps('email'),
    },
    // {
    //   title: 'reg no',
    //   dataIndex: 'reg_no',
    //   key: 'reg_no',
    //   width: '20%',
    //   ...getColumnSearchProps('reg_no'),
    // },
    {
      title: 'Functional Status',
      dataIndex: 'functional_status',
      key: 'functional_status',
      // width: '20%',
      ...getColumnSearchProps('functional_status'),
    },
    // {
    //   title: 'soc type name',
    //   dataIndex: 'soc_type_name',
    //   key: 'soc_type_name',
    //   width: '20%',
    //   ...getColumnSearchProps('soc_type_name'),
    // },
    // {
    //   title: 'dist name',
    //   dataIndex: 'dist_name',
    //   key: 'dist_name',
    //   width: '20%',
    //   ...getColumnSearchProps('dist_name'),
    // },
    // {
    //   title: 'zone name',
    //   dataIndex: 'zone_name',
    //   key: 'zone_name',
    //   width: '20%',
    //   ...getColumnSearchProps('zone_name'),
    // },
    // {
    //   title: 'range name',
    //   dataIndex: 'range_name',
    //   key: 'range_name',
    //   width: '20%',
    //   ...getColumnSearchProps('range_name'),
    // },
    // {
    //   title: 'soc tier name',
    //   dataIndex: 'soc_tier_name',
    //   key: 'soc_tier_name',
    //   width: '20%',
    //   ...getColumnSearchProps('soc_tier_name'),
    // }
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    //   ...getColumnSearchProps('address'),
    //   sorter: (a, b) => a.address.length - b.address.length,
    //   sortDirections: ['descend', 'ascend'],
    // },
  ];


// var pageDataCheck;

const searchData = location.state || {};

// const searchDataLength = Object.keys(searchData);


 
 useEffect(()=>{

 
  if(searchData['select_district']!=undefined)
    
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


  return (
    <>
    
    <div className="wrapper">
    <div className="inner_page_Sec">
    <div className='col-sm-12 searchPageTop'>
    <SearchBox district_def_Valu = {searchData.select_district} range_def_Valu = {searchData.select_range} type_def_Valu = {searchData.select_type} soci_Name_def_Valu = {searchData.society_Name} />
    </div>
    <div className="col-sm-12 left_sec search_data_table">

    <h1 className='search_page'>Search   <button className='pdfDownload'>Download PDF<i class="fa fa-file-pdf-o" aria-hidden="true"></i></button></h1>

    <Table columns={columns} dataSource={getPageData} scroll={{
        x: 'max-content',
      }} />



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