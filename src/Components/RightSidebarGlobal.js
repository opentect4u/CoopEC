import React from 'react'
import QuickLinkRight from './QuickLinkRight'
import SearchBox from './SearchBox'
import Tenders from './Tenders'

function RightSidebarGlobal() {

    const _tender_WordCount= 5;
    
  return (
    <>
    <div class="right_sec">
        <QuickLinkRight/>
        <SearchBox/>

        <div className="scroll_sec_ben">
			<h2>Tenders</h2>
            <div className="listNotice">
		    <div className="noticeScrollMainSub">
			<marquee className="marq" height="350px" direction="up" scrollamount="4" loop="">
            <Tenders wordCount={_tender_WordCount}/>
            </marquee>
            </div>
            </div>
			<a href="#">View All</a>
		</div>
    </div>
    </>
  )
}

export default RightSidebarGlobal