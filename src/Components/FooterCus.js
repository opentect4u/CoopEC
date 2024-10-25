import React, { useEffect, useState } from 'react'
import scroll_top from "../Assets/images/scroll_top.png";
import { BASE_URL } from '../routes/config';
import axios from 'axios';
import { Link } from 'react-router-dom';


function FooterCus() {

const [getImportantLinks, setImportantLinks] = useState([]);

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
    <div class="footerBlue">
	<div class="wrapper">
    <div class="col-sm-9 float-left footerLeft">
    <h2>More Links</h2>
    <ul>
    <li><a href="#">Home</a></li> 
    <li><a href="#">About Us </a></li> 
    <li><a href="#">Act &amp; Rules </a></li> 
    <li><a href="#">Notifications &amp; Orders</a></li> 
    <li><a href="#">Tenders</a></li> 
    <li><a href="#">Statistics</a></li> 
    <li><a href="#">Downloads</a></li> 
    <li><a href="#">Contact Us</a></li> 
    <li><a href="#">RTI</a></li>     
    <li><a href="/importantLinks">Important Links</a></li>     
    </ul>
    </div>
    {/* <div class="col-sm-3 float-left footerMidle">
    <h2>Important Links</h2>
    <ul>
      {getImportantLinks.map(item=>

      <li><Link to={item.links} target="_blank">{item.title}</Link> </li>

      )}

    </ul>
    </div> */}
    <div class="col-sm-3 float-left footerRight">
    <h2>Get in Touch</h2>
    <ul class="address">
    <li class="addresList">
    New Secretariat Building, Block - A, 4th Floor, 1, Kiran Sankar Roy Road Kolkata:700001</li>
    <li class="emailList"><a href="mailto:cecwestbengal2@gmail.com">cecwestbengal2@gmail.com</a></li>
    <li class="phonList"> +91 33 4444 6666/77</li>
    </ul>

    </div>
    </div>
</div>
	
<div class="footerWhite">Copyright © 2024 Co-operative Election Commission, West Bengal. All rights reserved.</div>
	
<a href="#" class="scroll_top"> <img src={`${scroll_top}`} alt=""/> </a>
    </>
  )
}

export default FooterCus