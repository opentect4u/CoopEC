import React, { useEffect, useState } from 'react'
import BannerSlider from '../../Components/BannerSlider'
import Anouncement from '../../Components/Anouncement'
import StatisticBox from '../../Components/StatisticBox'
import map_img from "../../Assets/images/map_real.png";
import gallery_ben from "../../Assets/images/gallery_ben.png";
import WelcomeHomeText from '../../Components/WelcomeHomeText';
import TabContentHome from '../../Components/TabContentHome';
import FaqPage from '../../Components/FaqPage';
import HomeThreeBox from '../../Components/HomeThreeBox';
import scroll_top from "../../Assets/images/scroll_top.png";
import FooterCus from '../../Components/FooterCus';
import WB_Map from '../../Components/WB_Map';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../routes/config';
import axios from 'axios';
import Loader from '../../Components/Loader';
// import Faq from '../../Components/Faq';

function Home() {

	const [getGalleryImage, setGalleryImage] = useState([]);
    const [getGalleryFolder, setGalleryFolder] = useState('');
    const [getStaticsData, setStaticsData] = useState('');
    const [loading, setLoading] = useState(true);


	const mapTxtWordCount= 5;

	const stats = [
		{
			title: 'Ongoing',
			count: '30',
			class_cus: 'bar_green'
		},
		{
			title: 'Completed Elections',
			count: '20',
			class_cus: 'bar_yellow'
		},
		{
			title: 'Due',
			count: '200',
			class_cus: 'bar_blue'
		}
	]

	const bottomThreeBox = [
		{
			title: 'Act &amp; Rules',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.',
			pageLink: '',
			class_cus: 'box_a'
		},
		{
			title: 'Statistics',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.',
			pageLink: '',
			class_cus: 'box_b'
		},
		{
			title: 'RTI (Right To Information)',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.',
			pageLink: '',
			class_cus: 'box_c'
		}
	]

	const fetchStaticsdata = ()=>{
		axios.post(`${BASE_URL}/wapi/getsocelestatics`,
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
		   
		   if(res.data.suc > 0){
			setStaticsData(res?.data?.msg)
			   // setFolderLocation()
			   console.log(res , 'hhhhhhhh', res?.data?.msg);
   
			   // pageDataCheck = res.data.status;
		   } else {
			setGalleryImage([])
			 // pageDataCheck = res.data.status;
		   }
	 
		   }
   
	   }) 
   
	  }


	const fetchGallerydata = ()=>{
		axios.post(`${BASE_URL}/wapi/gallimglist`,
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
		   
		   if(res.data.suc > 0){
			setGalleryImage(res?.data?.msg);
			setGalleryFolder(res?.data?.folder);
			// setPageTitle(res?.data?.title);
			setLoading(false);
			   // setFolderLocation()
			   console.log(res , 'gggggggg', res?.data?.msg);
   
			   // pageDataCheck = res.data.status;
		   } else {
			setGalleryImage([])
			 // pageDataCheck = res.data.status;
		   }
	 
		   }
   
	   }) 
   
	  }

	  useEffect(()=>{
		fetchGallerydata();
		fetchStaticsdata();
	   },[])


	return (
		<>
			<BannerSlider />

			<div className="wrapper">
				<div className="col-sm-12">
					<Anouncement />
				</div>
			</div>

			<div className="body_custom" id="main_info_content">

				<div className="wrapper map_sec_main">
					<div className="col-sm-12">
						<div className="map_sec">
							<div className="col-sm-5 float-left map_left_sec">

								<h2>Statistics</h2>
								{/* {getStaticsData.map(item =>
									<StatisticBox
										// title={item.title}
										count={item.done_tot}
										class_cus={item.class_cus}
									/>
								)} */}



								<div className={`bar_box bar_green bar_green`}>
								Ongoing     <span>{getStaticsData[0]?.ongoing_tot}</span>
								</div>
								<div className={`bar_box bar_green bar_yellow`}>
								Completed Elections     <span>{getStaticsData[0]?.done_tot}</span>
								</div>
								<div className={`bar_box bar_green bar_blue`}>
								Due     <span>{getStaticsData[0]?.due_tot}</span>
								</div>

								<div className="btn_sec">
									<Link to="/statistics">View All</Link>
								</div>

							</div>
							<div className="col-sm-7 float-left">
								<div className="right_map">
									{/* <img src={`${map_img}`} alt=""/> */}

									{/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className="bi bi-google"
        viewBox="0 0 16 16" style={{overflow: "hidden", position: "relative"}}
      >
        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
      </svg> */}

<WB_Map mapPopHover_Wordcount = {mapTxtWordCount} />


								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="welcomeSec">
					<div className="wrapper">
						<div className="welcomeSecLeft">
							<WelcomeHomeText />
						</div>
						<div className="welcomeSecRight">

							<h2><i className="fa fa-file-image-o" aria-hidden="true"></i> Gallery <Link to="/gallery">View All</Link></h2>

							{loading ?(
							<Loader align = {'center'} gap = {'middle'} size = {'large'} />
							):(
							<>
							<div className='homeGallery'>
							<ul>
							{getGalleryImage.slice(0, 3).map(item =>
							<li><img src={`${BASE_URL}/${getGalleryFolder}/${item.gal_img}`} alt="" /></li>
							)}
							</ul>
							</div>
							</>
							)}

							
							
						</div>
					</div>
				</div>

				{/* <TabContentHome /> */}

				{/* <div className='wrapper'>
				<div className='col-sm-6 float-left'> */}
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
				{/* </div>
				</div> */}


				{/* <div className="three_box">
					<div className="wrapper_sm">


						{bottomThreeBox.map(item =>
							<div className="col-sm-4 float-left">
								<HomeThreeBox
									title={item.title}
									description={item.description}
									pageLink={item.pageLink}
									class_cus={item.class_cus}
								/>
							</div>
						)}

					</div>
				</div> */}

				<FooterCus />

			</div>


		</>
	)
}

export default Home