import React, { useState } from 'react'
import axios from 'axios'
import { ADDRESSES } from '../routes/addresses'
import { useEffect } from 'react'
import  { CollapseProps } from 'antd';
// import { Collapse } from 'antd';
import { Collapse, Space } from 'antd';
import { BASE_URL } from '../routes/config';
import Loader from './Loader';

function FaqPage(
    {iconPosition, faqMax_item, SlNO_need}
) {
 

const [getFaqData, setFaqData] = useState([]);
const [loading, setLoading] = useState(true);





    const fetchdata = async ()=>{

    axios.post(`${BASE_URL}/wapi/faqlist`,
      {
        auth_key:"xxxxx",
      }
      // ,
      // {
      //     headers: {
      //         Authorization: loginData.token,
      //     },
      // }
      ).then(res => {
  
        if(res.status == '200'){
          // console.log('rrrrrr', res?.data?.msg);
          if(res.data.suc > 0){
            setFaqData(res?.data?.msg);
            setLoading(false)
              // setFolderLocation()
              console.log('rrrrrr', res?.data?.msg);
  
              // pageDataCheck = res.data.status;
          } else {
            setFaqData([])
            // pageDataCheck = res.data.status;
          }
    
          }
  
      }) 

   }

   useEffect(()=>{
    
    fetchdata();
   },[])

  return (
    <>
    {loading ?(
      <Loader align = {'center'} gap = {'middle'} size = {'large'} />
    ):(
      <>

{/* {getFaqData.slice(0, faqMax_item).map(item => (
  <Collapse
    key={item.faq_id} // Adding a key prop to the Collapse component
    className='faqCustom'
    accordion
    expandIconPosition={iconPosition}
    items={[
      {
        key: item.faq_id,
        label: item.question,
        children: item.answer,
      },
    ]}
  />
))} */}

{getFaqData.slice(0, faqMax_item).map((item, index) => (
  <Collapse
    key={item.faq_id} // Adding a key prop to the Collapse component
    className='faqCustom'
    accordion
    expandIconPosition={iconPosition}
    items={[
      {
        key: item.faq_id,
        // label: `${index + 1}. ${item.question}`, // Adding serial number
        label: SlNO_need ? `${index + 1}. ${item.question}` : item.question,
        children: item.answer,
        
      },
    ]}
  />
  
))}

      </>
    )}
    
    
  {/* </Space> */}
    </>
  )
}

export default FaqPage

