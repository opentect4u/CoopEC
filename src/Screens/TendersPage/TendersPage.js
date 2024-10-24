// import DefaultPage from '../../Components/DefaultPage';


import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useLocation, useParams } from "react-router-dom";
import FooterCus from '../../Components/FooterCus';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import SearchBox from '../../Components/SearchBox';
import pdf from "../../Assets/images/pdf.png";
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';
import { BASE_URL } from "../../routes/config";
import Loader from '../../Components/Loader';

function TendersPage() {

  const [getPageData, setPageData] = useState([]);
  const [getPageTitle, setPageTitle] = useState('');
  const [getFolderLocation, setFolderLocation] = useState('');
  const [loading, setLoading] = useState(true);

  let pageDataStore = [];

  const pageContentData = {
      pageTitle: 'Tenders',
      pageContent: getPageData?.body
    }
 

  const fetchdata = ()=>{
    axios.post(`${BASE_URL}/wapi/getdoclist`,
    {
      auth_key:"xxxxx",
      doc_type: 2
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
          setPageData(res?.data?.msg);
          setPageTitle(res.data.title);
          setFolderLocation(res?.data?.folder_name);
          setLoading(false);
          console.log(res , 'uuuuuuuuuuuuuuuuuuuuuu', res?.data?.msg);

            // pageDataCheck = res.data.status;
        } else {
          setPageData([0])
          // pageDataCheck = res.data.status;
        }
  
        }

    }) 

   }

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
      title: 'Name',
      dataIndex: 'doc_title',
      key: 'doc_title',
      width: '70%',
      ...getColumnSearchProps('doc_title'),
    },
    {
      title: 'Download',
      dataIndex: 'document',
      key: 'document',
      width: '30%',
     //  ...getColumnSearchProps('document'),
     render: (document) => <a href={BASE_URL +'/'+ getFolderLocation + document} className='docDownload' target='_blank'>
       <i class="fa fa-download" aria-hidden="true"></i> Download</a>,
    }
  ];

   useEffect(()=>{
    fetchdata();
   },[])

  return (
    <>
    <div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec searchPageTop">

    {loading ?(
      <Loader align = {'center'} gap = {'middle'} size = {'large'} />
    ):(
      <>
    <h1>{getPageTitle}</h1>
    <Table columns={columns} dataSource={getPageData} scroll={{
        x: 'max-content',
      }} />
      </>
    )}


    
     </div>
     <div class="col-sm-4 float-left">
      <RightSidebarGlobal/>
    </div>

    </div>
    </div>

      {/* <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} /> */}

      <FooterCus/>

    </>
  )
}

export default TendersPage