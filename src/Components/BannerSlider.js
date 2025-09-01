import React from 'react'
import SearchBox from './SearchBox'
import Slider from "react-slick";

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
	<div className='bannerSlide bannerSlide_Common'></div>
	<div className='bannerSlide2 bannerSlide_Common'></div>
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