import React from 'react'
import SearchBox from './SearchBox'

function BannerSlider() {
  return (
    <>
    
    <div className="bannerSliderMain">

	
	<div className="wrapper">
	<div className="col-sm-4 float-left left_search_sec">
    <SearchBox/>
	</div>
	<div className="col-sm-8 float-left slider_sec">
	<div className="slider_sec_sub">
		<h2>Co-operative Election Commission, <span>West Bengal</span></h2>
		{/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
			labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.</p> */}
	</div>
	</div>
	</div>
</div>
    </>
  )
}

export default BannerSlider