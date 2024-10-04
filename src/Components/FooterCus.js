import React from 'react'
import scroll_top from "../Assets/images/scroll_top.png";

function FooterCus() {
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
    <li><a href="#">Important Announcement </a></li> 
    <li><a href="#">Notifications &amp; Orders</a></li> 
    <li><a href="#">Tenders</a></li> 
    <li><a href="#">Statistics</a></li> 
    <li><a href="#">Downloads</a></li> 
    <li><a href="#">Contact Us</a></li> 
    <li><a href="#">Gallery </a></li> 
    <li><a href="#">Important Links</a></li> 
    <li><a href="#">RTI</a></li>         
    </ul>
    </div>
    <div class="col-sm-3 float-left footerRight">
    <h2>Get in Touch</h2>
    <ul class="address">
    <li class="addresList">
Southend Conclave, 3rd Floor,
1582 Rajdanga Main Road,
Kolkata - 700 107.</li>
    <li class="emailList"><a href="mailto:info@benfed.org">info@demo.com</a></li>
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