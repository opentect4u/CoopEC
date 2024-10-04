import React, { useState } from 'react'
import axios from 'axios'
import { ADDRESSES } from '../routes/addresses'
import { useEffect } from 'react'

function ImportantLinks(
    {
    wordCount
    }
) {

    const fetchdata = async ()=>{

        return new Promise((resolve, reject) => {
        // axios.get(ADDRESSES.GST_LIST).then(res => {
        axios.get('https://jsonplaceholder.org/posts'
        // {},
        // {
        //     headers: {
        //         Authorization: loginData.token,
        //     },
        // }
        ).then(res => {
        console.log(res.data[0], 'hhhhhhffhhhhhhh'); 
        setImportantLinks(res?.data)
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
  
   const [getImportantLinks, setImportantLinks] = useState();

   useEffect(()=>{
    fetchdata();
   },[])

  return (
    <>
    {getImportantLinks?.map(item=>
    <p>
        {wordCount}
    {limitWords(item?.content, wordCount)}
    <span><i className="fa fa-clock-o" aria-hidden="true"></i> {item?.slug} </span>
    </p>
    )}

    {getImportantLinks?.content}
    </>
  )
}

export default ImportantLinks