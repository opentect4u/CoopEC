import React from 'react'
import FooterCus from './FooterCus'
import RightSidebarGlobal from './RightSidebarGlobal'

export default function DefaultPage({
    pageTitle,
    pageContent
}) {
  return (
    <>
    <div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec">
        
    <h1>{pageTitle}</h1>
    {pageContent}

    </div>

    <div class="col-sm-4 float-left">
      <RightSidebarGlobal/>
    </div>

    </div>
    </div>

    <FooterCus/>
    </>
  )
}
