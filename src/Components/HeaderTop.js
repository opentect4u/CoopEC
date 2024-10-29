import React from 'react'
import { Link } from 'react-router-dom'
// import logo from "../../Assets/Images/a.png";
import acce_a from "../Assets/images/a.png";
import acce_b from "../Assets/images/aa.png";
import acce_c from "../Assets/images/aaa.png";
import logo from "../Assets/images/logo.png";
import TopMenu from './TopMenu';
import { BASE_URL } from '../routes/config';
import {Detector, Online, Offline} from "react-detect-offline"
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';

function HeaderTop() {
const navigation = useNavigate();

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
	<li><i className="fa fa-envelope" aria-hidden="true"></i> <a href="mailto:cecwestbengal2@gmail.com">cecwestbengal2@gmail.com</a></li>
	</ul>
	</div>
	<div className="rightNav">
	<div className="language">
	<ul>
	<li className='scrnn_page'><a href="#">Screen Reader Access</a></li> 	
	<li className='skip_btn'><a href="#main_info_content">Skip to Main Content</a></li> 
    
	<li className='fontResize'>
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
    <li className='topLogin_'><Link to={`${BASE_URL}/login`} target="_blank">Login</Link></li>
	</ul>
	</div>
	</div>
		
	</div>
</div>

<div className="wrapper logosection">
	<div className="logoArea">
	<Link to="/"><img src={`${logo}`} alt=""/></Link>
    
	</div>


	
	<div className="login">
	<ul>
    
	<li className='topLogin'><Link to={`${BASE_URL}/login`} target="_blank">Login</Link></li>
    <li className='fontResize'>
	{/* javascript:decreaseFontSize(); */}
    <a href="javascript:void(0)" onClick={() => decreaseFontSize()}><img src={`${acce_a}`} alt=""/></a> 
    <a href="javascript:void(0)" onClick={() => defaiultFontSize()}><img src={`${acce_b}`} alt=""/></a>
    <a href="javascript:void(0)" onClick={() => increaseFontSize()}><img src={`${acce_c}`} alt=""/></a>
	</li>
    <li className='colorTogle'><div className="toggle" onClick={() => toggle()} >
        <div className="circle"></div>
    </div>
    <span className="text" style={{display: 'none'}}>FF</span></li>	
	</ul>
	</div>
</div>

	<div className="topNavmain">
	<div className="wrapper navArea">
	<TopMenu/>
	</div>
	</div>


        
        </>
  )
}

export default HeaderTop