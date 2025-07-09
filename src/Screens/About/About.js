import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useEffect } from 'react'
import DefaultPage from '../../Components/DefaultPage';
import { Button } from 'antd';
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';
import FooterCus from '../../Components/FooterCus';
import election_key_persion from "../../Assets/images/election_key.jpg";

function About() {

  const [getPageData, setPageData] = useState([]);
  
  

  let pageDataStore = [];

  const pageContentData = {
      pageTitle: 'About Us',
      pageContent: getPageData?.body
    }
 

  // const fetchdata = ()=>{
  //   return new Promise((resolve, reject) => {
  //   axios.get('https://jsonplaceholder.typicode.com/posts/1',
  //   // {},
  //   // {
  //   //     headers: {
  //   //         Authorization: loginData.token,
  //   //     },
  //   // }
  //   ).then(res => {

  //   if(res.status == '200'){
  //   pageDataStore = res.data
  //   setPageData(pageDataStore)
  //   resolve(res.data);
  //   console.log(pageDataStore.title, 'ddddddd' , res);
  //   }
  //   }).then(() =>{
  //   pageDataStore = []
  //   }).catch(err => {
  //   console.log(err);
  //   reject(err); 
  //   });
  //   });
  //  }

  

   useEffect(()=>{
    // fetchdata();
   },[])




  return (
    <>

<div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec searchPageTop">

    <h1>About Us</h1>

    <h3>Co-operative Election Commission W.B.</h3>
<p>Welcome to the West Bengal Cooperative Election Commission (WBCEC), a government body that organizes elections for cooperative societies in West Bengal. WBCEC ensures that elections are conducted fairly, transparently, and in accordance with the law. Members of cooperative societies, like credit cooperatives, farming cooperatives, and housing cooperatives, make decisions democratically by voting.</p>
<h3>Our Mission</h3>
<p>Our mission at WBCEC is to safeguard cooperative societies' democratic functioning through impartial and efficient elections. It is our goal to ensure the cooperative movement continues to serve its members fairly and justly by upholding the principles of transparency, integrity, and accountability. The regular election process reinforces the democratic framework within the cooperative structure by empowering cooperative members to choose their leaders and representatives. </p><h3>Functions and Responsibilities</h3>
<p>WBCEC follows these key functions and responsibilities to maintain the democratic structure of cooperatives, ensuring a fair and transparent election process. </p>
<p><strong>Conducting Elections: </strong>We organize and manage the entire election process for cooperative societies. From setting the election dates to preparing the voter lists - all are in our shoulder,  making sure that votes are counted correctly.</p>
<p><strong>Ensuring Fairness: </strong>We have the responsibility to ensure that all elections follow the rules of the West Bengal Cooperative Societies Act, 2006, and the specific rules of each cooperative. During the election, we assist in resolving any disputes or problems.</p>
<p><strong>Electoral Rolls: </strong>We prepare and maintain the list of members who are eligible to vote in the elections. It is a vital step in elections by cooperative societies. During the election process, it ensures accuracy and transparency.</p>
<p><strong>Appointing Officers: </strong>We assign qualified election officers and other officials to oversee the election process in various cooperative societies.</p>
<h3>Our Vision</h3>
<p>As a member of the WBCEC, we are proud to be playing a key role in preserving the spirit of democracy in cooperative societies. The main vision of the West Bengal Cooperative Election Commission (WBCEC) is to establish democratic governance in the cooperative sector by creating a robust electoral framework. We aim to make this election process as transparent and accessible as possible encouraging active participation from all cooperative members. In doing so, we strive to strengthen the cooperative movement, which has a rich legacy of contributing to economic and social development in West Bengal.</p>

<div className='election_keyMember'><img src={`${election_key_persion}`} alt="" /></div>

    {/* {loading ?(
      <Loader align = {'center'} gap = {'middle'} size = {'large'} />
    ):(
      <>
      <h1>{getPageTitle}</h1>
    <Table columns={columns} dataSource={getPageData} scroll={{
    x: 'max-content',
    }} />
      </>
    )} */}

    </div>
    <div class="col-sm-4 float-left">
    <RightSidebarGlobal/>
    </div>

    </div>
    </div>

    <FooterCus/>

      {/* <DefaultPage pageTitle={pageContentData.pageTitle} pageContent = {pageContentData.pageContent} /> */}
    </>
  )
}

export default About