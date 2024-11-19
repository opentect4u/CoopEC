import React, { useEffect, useState } from 'react'
import QuickLinkRight from './QuickLinkRight'
import SearchBox from './SearchBox'
import Tenders from './Tenders'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../routes/config'
import Anouncement from './Anouncement'

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
            <Anouncement wordCount={_tender_WordCount}/>

            </marquee>
            </div>
            </div>

      <Link to="/importantannouncement" className="view-all-link"> View All </Link>
		</div>
    </div>
    </>
  )
}

export default RightSidebarGlobal