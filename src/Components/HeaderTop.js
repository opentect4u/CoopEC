import React from 'react'
import { Link } from 'react-router-dom'
// import logo from "../../Assets/Images/a.png";
import acce_a from "../Assets/images/a.png";
import acce_b from "../Assets/images/aa.png";
import acce_c from "../Assets/images/aaa.png";
import logo from "../Assets/images/logo.png";
import TopMenu from './TopMenu';

function HeaderTop() {

var default_siz = 14;
var min = 12;
var max = 32;

let active = false

const toggle = () => {
    let toggle = document.querySelector('.toggle')
    let text = document.querySelector('.text')
    active = !active
    if (active) {
        toggle.classList.add('active')
		// $("body").addClass("black_White");
		document.body.classList.add('black_White');
		
    } else {
        toggle.classList.remove('active')
		// $("body").removeClass("black_White");
		document.body.classList.remove('black_White');
    }
}




const increaseFontSize = () => {
    var p = document.querySelectorAll('p');

	console.log('p.length')
	
    for (var i = 0; i < p.length; i++) {
        if (p[i].style.fontSize) {
            var s = parseInt(p[i].style.fontSize.replace("px", ""));
        } else {

            var s = 14;
        }
        if (s != max) {
            s += 1;
        }
        p[i].style.fontSize = s + "px"
    }
	
	
}

const decreaseFontSize = () => {
	var p = document.querySelectorAll('p');

    for (var i = 0; i < p.length; i++) {

        if (p[i].style.fontSize) {
            var s = parseInt(p[i].style.fontSize.replace("px", ""));
        } else {
            var s = 12;
        }
        if (s != min) {
            s -= 1;
        }
        p[i].style.fontSize = s + "px"
    }
}

const defaiultFontSize = () => {
	var p = document.querySelectorAll('p');
    for (var i = 0; i < p.length; i++) {
        p[i].style.fontSize = default_siz + "px"
    }
}




  return (
    <>
    <div className="topBar">
	<div className="wrapper">
	<div className="leftNav">
	<ul>
	<li><i className="fa fa-phone" aria-hidden="true"></i> <a href="tel:+91 33 2441 4366">+91 33 4444 6666</a></li>
	<li><i className="fa fa-envelope" aria-hidden="true"></i> <a href="mailto:info@benfed.org">info@demo.com</a></li>
	</ul>
	</div>
	<div className="rightNav">
	<div className="language">
	<ul>
	<li><a href="#">Screen Reader Access</a></li> 	
	<li><a href="#main_info_content">Skip to Main Content</a></li> 
	<li>
	{/* javascript:decreaseFontSize(); */}
    <a href="javascript:void(0)" onClick={() => decreaseFontSize()}><img src={`${acce_a}`} alt=""/></a> 
    <a href="javascript:void(0)" onClick={() => defaiultFontSize()}><img src={`${acce_b}`} alt=""/></a>
    <a href="javascript:void(0)" onClick={() => increaseFontSize()}><img src={`${acce_c}`} alt=""/></a>
	</li>	
	<li>
    {/* <div className="toggle" onclick="toggle()" > */}
	<div className="toggle" onClick={() => toggle()} >
        <div className="circle"></div>
    </div>
    <span className="text" style={{display: 'none'}}>FF</span>
		</li>
	</ul>
	</div>
	</div>
		
	</div>
</div>

<div className="wrapper logosection">
	<div className="logoArea">
    <img src={`${logo}`} alt=""/>
	</div>
	
	<div className="login">
	<ul>
	<li><a href="#" target="_blank">Login</a></li>	
	</ul>
	</div>
</div>

	<div className="topNavmain">
	<div className="wrapper navArea">
	<TopMenu/>
	</div>
	</div>

{/* <div className="topNavmain">
	<div className="wrapper navArea">
	<ul>
	<li><Link to={'/'}>Home</Link></li>
	<li className="sub_menu_li"><Link to={'/about'}>About Us</Link>
		
		<ul className="subMenu">
		<li><a href="#">Powers &amp; Responsibility</a></li>
		<li><a href="#">Constitution</a></li>
		<li><a href="#">Organization</a></li>
		<li><a href="#">Officers</a></li>
		<li><a href="#">Location</a></li>
		</ul>
		</li>
	<li><Link to={'/actRules'}>Act & Rules</Link></li>
	<li className="sub_menu_li"><Link to={'/importantannouncement'}>Important Announcement</Link>
		<ul className="subMenu">
		<li><a href="#">Election</a></li>
		<li><a href="#">Results</a></li>
		<li><a href="#">Miscellaneous</a></li>
		</ul>
		
		</li>
	<li><Link to={'/notificationsorders'}>Notifications & Orders</Link></li>
	<li><a href="#">Tenders</a></li>
	<li className="sub_menu_li"><a href="#"> Downloads</a>
		
		<ul className="subMenu">
		<li><a href="#">Orders &amp; Circulars</a></li>
		<li><a href="#">Election Handbook</a></li>
		<li><a href="#">Model Code of Conduct</a></li>
		<li><a href="#">Statutory Election Forms</a></li>
		<li><a href="#">Statutory Report Format</a></li>
		</ul>
		
		</li>
	<li><a href="#"> Gallery </a></li>
	<li><a href="#"> Contact Us</a></li>
	</ul>
		

	</div>	
</div> */}

        {/* <Link to={'/'}>Home</Link>
        <Link to={'/about'}>About</Link> */}
        
        </>
  )
}

export default HeaderTop