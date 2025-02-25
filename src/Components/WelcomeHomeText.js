import React from 'react'
import about from "../Assets/images/about.png";
import { Link } from 'react-router-dom';

function WelcomeHomeText() {

  return (
    <>
    <h1>About   <span>Co-operative Election Commission W.B.</span> </h1>
    <p>
    <img src={`${about}`} alt="" style={{float: 'right', paddingLeft:15}}/>
    Welcome to the West Bengal Cooperative Election Commission (WBCEC), a government body that organizes elections for cooperative 
    societies in West Bengal. WBCEC ensures that elections are conducted fairly, transparently, and in accordance with the law. Members of 
    cooperative societies, like credit cooperatives, farming cooperatives, and housing cooperatives, make decisions democratically by voting.</p>
    <Link to="/about">Read More &gt;&gt;</Link>
    </>
  )
}

export default WelcomeHomeText