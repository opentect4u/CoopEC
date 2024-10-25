
import React, { useEffect, useState } from 'react'
import Loader from '../../Components/Loader'
import FooterCus from '../../Components/FooterCus';
import RightSidebarGlobal from '../../Components/RightSidebarGlobal';
import { BASE_URL } from '../../routes/config';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ImportantLinks() {

const [getImportantLinks, setImportantLinks] = useState([]);
const [loading, setLoading] = useState(true);

const fetchdata = ()=>{
  
  axios.post(`${BASE_URL}/wapi/qlinkslist`,
 {
   auth_key:"xxxxx",
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
         setImportantLinks(res?.data?.msg);
         setLoading(false);
         // setFolderLocation()
         console.log(res.data.msg[0].title , 'uuuuuuuuuuuuuuuuuuuuuu', res?.data?.msg);

         // pageDataCheck = res.data.status;
     } else {
        setImportantLinks([])
        // pageDataCheck = res.data.status;
     }

     }

 }) 

}


useEffect(()=>{
  fetchdata()
},[])

    
  return (

    <>
    <div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec searchPageTop">

    
    {/* <h1>{getPageTitle}</h1> */}
    <h1>Important Links</h1>

    {loading ?(
    <Loader align = {'center'} gap = {'middle'} size = {'large'} />
    ):(
    <> 
    <ul>
    {getImportantLinks.map(item=>

    <li><Link to={item.links} target="_blank"> <i class="fa fa-angle-right" aria-hidden="true"></i>  {item.title}</Link> </li>

    )}
    </ul>


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

export default ImportantLinks