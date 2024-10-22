import React from 'react'
import QuickLinkRight from './QuickLinkRight'
import SearchBox from './SearchBox'
import Tenders from './Tenders'
import { Link } from 'react-router-dom'

function RightSidebarGlobal() {

    const _tender_WordCount= 5;
    
  return (
    <>
    <div class="right_sec">
        {/* <QuickLinkRight/> */}
        <SearchBox/>

        <div className="scroll_sec_ben">
			<h2>Announcement</h2>
            <div className="listNotice">
		    <div className="noticeScrollMainSub">
			<marquee className="marq" height="350px" direction="up" scrollamount="4" loop="">
            <Tenders wordCount={_tender_WordCount}/>
            </marquee>
            </div>
            </div>
			{/* <a href="#">View All</a> */}
      <Link to="/importantannouncement" className="view-all-link"> View All </Link>
		</div>
    </div>
    </>
  )
}

export default RightSidebarGlobal