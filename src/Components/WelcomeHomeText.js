import React from 'react'
import about from "../Assets/images/about.png";

function WelcomeHomeText() {

  return (
    <>
    <h1>About   <span>Co-operative Election Commission W.B.</span> </h1>
    <p>
    <img src={`${about}`} alt="" style={{float: 'right'}}/>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do  eiusmod tempor incididunt ut labore et dolore magna aliqua. 
    Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus  commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet.</p>
    <a href="#">Read More &gt;&gt;</a>
    </>
  )
}

export default WelcomeHomeText