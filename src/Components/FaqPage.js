import React, { useState } from 'react'
import axios from 'axios'
import { ADDRESSES } from '../routes/addresses'
import { useEffect } from 'react'
import  { CollapseProps } from 'antd';
// import { Collapse } from 'antd';
import { Collapse, Space } from 'antd';
import { BASE_URL } from '../routes/config';

function FaqPage(
    {iconPosition}
) {
    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const [getFaqData, setFaqData] = useState([]);

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    children: <p>{text}</p>,
  },
];

// const items_2 = [];
// const forLoopPushData = ()=>{
//   for (let i = 0; i < getFaqData.length; i++) {
//     items_2.push({
//     key: i,
//     label: getFaqData[i].name,
//     children: getFaqData[i].body,
//     })
//     console.log(getFaqData, i, 'llllllllllll');
//   }
//   console.log(items_2, 'rrrrrrrrrrrrrrrrrr');
// }


    const fetchdata = async ()=>{

    // return new Promise((resolve, reject) => {
    //     // axios.get(ADDRESSES.GST_LIST).then(res => {
    //     axios.get('https://jsonplaceholder.typicode.com/posts/1/comments',
    //             // {},
    //             // {
    //             //     headers: {
    //             //         Authorization: loginData.token,
    //             //     },
    //             // }
    //     ).then(res => {
    //         console.log(res.data, 'hhhhhhhhhhhhh'); 
    //         setFaqData(res.data)
    //         resolve(res.data);
    //         // forLoopPushData();
            
    //     }).catch(err => {
    //         console.log(err);
    //         reject(err);
    //     });
    // });

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

    {/* <Collapse className='faqCustom' bordered={false} accordion items={items} expandIconPosition={iconPosition} /> */}
    {/* {items_2 && <Collapse className='faqCustom' bordered={false} accordion items={items_2} expandIconPosition={iconPosition} />} */}
    {getFaqData.map(item=>
    <Collapse className='faqCustom' accordion expandIconPosition={iconPosition} 
    //   collapsible="header"
      items={[
        {
          key: item.faq_id,
          label: item.question,
          children: item.answer,
        },
      ]}
    />
    )}
    
  {/* </Space> */}
    </>
  )
}

export default FaqPage

