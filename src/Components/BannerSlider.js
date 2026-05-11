import React from 'react'
import SearchBox from './SearchBox'
import Slider from "react-slick";
import banner_1 from "../Assets/images/banner_img_1.jpg";
import banner_2 from "../Assets/images/banner_img_2.jpg";
import banner_3 from "../Assets/images/banner_img_3.jpg";

function BannerSlider() {

	const settings = {
    dots: true,        // navigation dots
    infinite: true,    // infinite loop
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,    // auto play
    autoplaySpeed: 3000
  };

  return (
    <>
    
    <div className="bannerSliderMain">
	<div className='bannerSliderOverlay'>
	<Slider {...settings}>
	<div className='bannerSlide bannerSlide_Common'><img src={`${banner_1}`} alt=""/></div>
	<div className='bannerSlide2 bannerSlide_Common'><img src={`${banner_2}`} alt=""/></div>
	<div className='bannerSlide2 bannerSlide_Common'><a href='/about'><img src={`${banner_3}`} alt=""/></a></div>
	</Slider>
	</div>
	
	{/* <div className="wrapper">
	<div className="col-sm-4 float-left left_search_sec">
    <SearchBox />
	</div>
			


	<div className="col-sm-8 float-left slider_sec">
	<div className="slider_sec_sub"> </div>
	</div>
	</div> */}

</div>

	<div className="wrapper">
	<div className="col-sm-12 float-left left_search_sec">
    <SearchBox />
	</div>
	</div>

    </>
  )
}

export default BannerSlider