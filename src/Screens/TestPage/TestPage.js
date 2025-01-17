import React, { useEffect, useState } from 'react'
import Sidebar from '../../Components/sidebar'
import FooterCus from '../../Components/FooterCus'
import axios from 'axios';
import { BASE_URL } from '../../routes/config';
import { Link } from 'react-router-dom';
import FaqPage from '../../Components/FaqPage';
import Loader from '../../Components/Loader';
import useStatisticData from '../../Hooks/API/StatisticData';



function TestPage() {

const [getOngoingData, setOngoingData] = useState('');
const [getCompletData, setCompletData] = useState('');
const [getDueData, setDueData] = useState('');
const [loading_statis, setLoading_statis] = useState(true);

const [getFaqData, setFaqData] = useState([]);
const [loading, setLoading] = useState(true);

const { fetchStatistics } = useStatisticData()

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
        console.log('ggggggggggggggggggggggg', res?.data?.msg.length);
  
        // pageDataCheck = res.data.status;
      } else {
      setFaqData([])
      // pageDataCheck = res.data.status;
      }
  
      }
  
    }) 

   }


   const fetchStaticsdata_ongoing = (para)=>{

    axios.post(`${BASE_URL}/wapi/societyelectionstatus`,
      {
      auth_key:"xxxxx",
      election_status: para,
      }
      // ,
      // {
      //     headers: {
      //         Authorization: loginData.token,
      //     },
      // }
      ).then(res => {
  
      if(res.status == '200'){
        console.log(res, 'ffffffff', res?.data?.msg.length);
        
        if(res.data.suc > 0){
          setOngoingData(res?.data?.msg)
          setLoading_statis(false)
          console.log(res?.data?.msg, 'gggggggggggggggggggggggffff');
  
          // pageDataCheck = res.data.status;
        } else {
          setOngoingData([])
          setLoading_statis(false);
        // pageDataCheck = res.data.status;
        }
  
        }
  
      }) 
  
    }



  const fetchStatistics_Call = async ()=>{
    await fetchStatistics('ONGOING').then((res)=>{
      setOngoingData(res?.msg)
      setLoading_statis(false)
      
    }).catch((error)=>{
      console.log(error);
      
    })

    await fetchStatistics('DUE').then((res)=>{
      setDueData(res?.msg)
      setLoading_statis(false)
      
    }).catch((error)=>{
      console.log(error);
      
    })

    await fetchStatistics('DONE').then((res)=>{
      setCompletData(res?.msg)
      setLoading_statis(false)
      
    }).catch((error)=>{
      console.log(error);
      
    })

  }

   useEffect(()=>{
    fetchStatistics_Call();
    fetchdata();
    },[])


  return (
    <>

<div className="col-sm-5 float-left map_left_sec">

<h2>Statistics</h2>



<div className={`bar_box bar_green bar_green`}>
Ongoing     <span>
{loading_statis ?(
<Loader align = {'center'} gap = {'middle'} size = {'small'} />
):(
<>
{/* {getOngoingData?.length} */}
{getOngoingData?.length}
</>
)}

</span>
</div>
<div className={`bar_box bar_green bar_yellow`}>
Completed Elections     <span>
{loading_statis ?(
<Loader align = {'center'} gap = {'middle'} size = {'small'} />
):(
<>
{getCompletData?.length}
</>
)}
  </span>
</div>
<div className={`bar_box bar_green bar_blue`}>
Due     <span>
{loading_statis ?(
<Loader align = {'center'} gap = {'middle'} size = {'small'} />
):(
<>
{getDueData?.length}
</>
)}
  </span>
</div>

<div className="btn_sec">
  <Link to="/statistics">View All</Link>
</div>

</div>

{getFaqData.length > 0 &&(
					<div className="faqSec">

					<div className="section-header text-center">

						<h2 className="title">FAQs</h2>
						{/* <p className="style-two-des pp">Discover answers to all your questions and enhance your understanding to make smarter decisions on saving, investing, and spending. Explore all queries here for valuable insights!</p> */}
					</div>

					<div className="faqs-section">
						<div className="container">
							<div className="row d-flex justify-content-center">
								<div className="col-sm-10">
									<FaqPage iconPosition={'end'} faqMax_item= {3} SlNO_need= {false}/>

									<div className="btn_sec"><Link to="/faq">View All</Link></div>

								</div>
							</div>
						</div>
					</div>

				</div>
				)}

    <FooterCus/>
  </>
  )
}

export default TestPage