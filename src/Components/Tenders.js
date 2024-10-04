import React, { useState } from 'react'
import axios from 'axios'
import { ADDRESSES } from '../routes/addresses'
import { useEffect } from 'react'

function Tenders(
    {
    wordCount
    }
) {

  const [getTenderData, setTenderData] = useState([]);

   const fetchdata = async ()=>{

    // await axios.get(ADDRESSES.GST_LIST).then(res => {
    // await axios.get('https://jsonplaceholder.typicode.com/todos/').then(res => {
    //     console.log(res.data, 'hhhhhhhhhhhhh');   
    // }).catch(err => {
    //     console.log(err);
    // });


    return new Promise((resolve, reject) => {
        // axios.get(ADDRESSES.GST_LIST).then(res => {
        axios.get('https://jsonplaceholder.typicode.com/posts/1/comments',
                // {},
                // {
                //     headers: {
                //         Authorization: loginData.token,
                //     },
                // }
        ).then(res => {
            // console.log(res.data, 'hhhhhhhhhhhhh'); 
            setTenderData(res.data)
            resolve(res.data);
            
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });


   }

   function limitWords(content, wordLimit) {
    const words = content?.split(' ');
    if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
    }




   useEffect(()=>{
    fetchdata();
   },[])

    // const gstSettings = await handleGetGst();

  return (
    <>
    {getTenderData?.map(item=>
    <p>
    {wordCount}
    {limitWords(item?.body, wordCount)}
    <span><i className="fa fa-clock-o" aria-hidden="true"></i> {item.email} </span> </p>
    )}
    </>
  )
}

export default Tenders