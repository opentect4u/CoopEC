import React from 'react'
import RightSidebarGlobal from '../../Components/RightSidebarGlobal'
import FooterCus from '../../Components/FooterCus'
import FaqPage from '../../Components/FaqPage'

function Faq() {
  return (
    <>
    <div class="wrapper">
    <div class="inner_page_Sec">
    <div class="col-sm-8 float-left left_sec faqPage">
    <h1>Faq</h1>
    <FaqPage iconPosition={'end'} SlNO_need= {true} />
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

export default Faq