
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useLocation, useParams } from "react-router-dom";
import RightSidebarGlobal from './RightSidebarGlobal';
import FooterCus from './FooterCus';
import SearchBox from './SearchBox';


// import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
const data = [
  {
    id: '1',
    cop_soc_name: 'John Brown hhhhhh',
    last_elec_date: null,
    tenure_ends_on: null,
    contact_name: "SIPRA MAJUMDER",
    contact_designation: null,
    contact_number: "9073568976",
    email: "anupamatilottama@gmail.com",
    reg_no: "9/24 pGS.",
    functional_status: "Functional",
    soc_type_name: "Housing Co-operative Society",
    dist_name: "HOWRAH",
    zone_name: "Central Zone",
    range_name: "Howrah Range",
    soc_tier_name: null
  },
  {
    id: '2',
    cop_soc_name: 'John Brown',
    last_elec_date: null,
    tenure_ends_on: null,
    contact_name: "SIPRA MAJUMDER",
    contact_designation: null,
    contact_number: "9073568976",
    email: "anupamatilottama@gmail.com",
    reg_no: "9/24 pGS.",
    functional_status: "Functional",
    soc_type_name: "Housing Co-operative Society",
    dist_name: "HOWRAH",
    zone_name: "Central Zone",
    range_name: "Howrah Range",
    soc_tier_name: null
  },
  {
    id: '3',
    cop_soc_name: 'John rrrr hhhhhh',
    last_elec_date: null,
    tenure_ends_on: null,
    contact_name: "SIPRA MAJUMDER",
    contact_designation: null,
    contact_number: "9073568976",
    email: "anupamatilottama@gmail.com",
    reg_no: "9/24 pGS.",
    functional_status: "Functional",
    soc_type_name: "Housing Co-operative Society",
    dist_name: "HOWRAH",
    zone_name: "Central Zone",
    range_name: "Howrah Range",
    soc_tier_name: null
  },
  {
    id: '4',
    cop_soc_name: 'John hhhhhh',
    last_elec_date: null,
    tenure_ends_on: null,
    contact_name: "SIPRA MAJUMDER",
    contact_designation: null,
    contact_number: "9073568976",
    email: "anupamatilottama@gmail.com",
    reg_no: "9/24 pGS.",
    functional_status: "Functional",
    soc_type_name: "Housing Co-operative Society",
    dist_name: "HOWRAH",
    zone_name: "Central Zone",
    range_name: "Howrah Range",
    soc_tier_name: null
  },
];



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
      title: 'cop soc name',
      dataIndex: 'cop_soc_name',
      key: 'cop_soc_name',
      width: '30%',
      ...getColumnSearchProps('cop_soc_name'),
    },
    {
      title: 'last elec date',
      dataIndex: 'last_elec_date',
      key: 'last_elec_date',
      width: '20%',
      ...getColumnSearchProps('last_elec_date'),
    },
    {
      title: 'tenure ends on',
      dataIndex: 'tenure_ends_on',
      key: 'tenure_ends_on',
      width: '20%',
      ...getColumnSearchProps('tenure_ends_on'),
    },
    {
      title: 'contact name',
      dataIndex: 'contact_name',
      key: 'contact_name',
      width: '20%',
      ...getColumnSearchProps('contact_name'),
    },
    {
      title: 'contact designation',
      dataIndex: 'contact_designation',
      key: 'contact_designation',
      width: '20%',
      ...getColumnSearchProps('contact_designation'),
    },
    {
      title: 'contact number',
      dataIndex: 'contact_number',
      key: 'contact_number',
      width: '20%',
      ...getColumnSearchProps('contact_number'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'reg no',
      dataIndex: 'reg_no',
      key: 'reg_no',
      width: '20%',
      ...getColumnSearchProps('reg_no'),
    },
    {
      title: 'functional status',
      dataIndex: 'functional_status',
      key: 'functional_status',
      width: '20%',
      ...getColumnSearchProps('functional_status'),
    },
    {
      title: 'soc type name',
      dataIndex: 'soc_type_name',
      key: 'soc_type_name',
      width: '20%',
      ...getColumnSearchProps('soc_type_name'),
    },
    {
      title: 'dist name',
      dataIndex: 'dist_name',
      key: 'dist_name',
      width: '20%',
      ...getColumnSearchProps('dist_name'),
    },
    {
      title: 'zone name',
      dataIndex: 'zone_name',
      key: 'zone_name',
      width: '20%',
      ...getColumnSearchProps('zone_name'),
    },
    {
      title: 'range name',
      dataIndex: 'range_name',
      key: 'range_name',
      width: '20%',
      ...getColumnSearchProps('range_name'),
    },
    {
      title: 'soc tier name',
      dataIndex: 'soc_tier_name',
      key: 'soc_tier_name',
      width: '20%',
      ...getColumnSearchProps('soc_tier_name'),
    }
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
            console.log(res.data.msg, 'uuuuuuuuuuuuuuuuuuuuuu', getPageData);

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
    <SearchBox/>
    </div>
    <div className="col-sm-12 left_sec">

    <h1>Search</h1>

    <Table columns={columns} dataSource={getPageData} scroll={{
        x: 'max-content',
      }} />

    {/* {getPageData.map(item =>
    item === 0 ? (
    <div>No Item</div>
    ) : (
    <div className='search_Card'>
    <h3>{item.contact_name}</h3>
    <p>{item?.cop_soc_name}</p>
    </div>
    )
    )} */}

    {/* District: {searchData.select_district} <br/>
    Range: {searchData.select_range}<br/>
    Type: {searchData.select_type}<br/>
    Society Name: {searchData.society_Name} */}

    </div>

    {/* <div class="col-sm-4 float-left">
    <div class="right_sec">
    <SearchBox/>
    </div>
    </div> */}

    </div>
    </div>

    <FooterCus/>
    </>
  )
}

export default SearchPage