import React from 'react'
import { Link } from 'react-router-dom'

function HomeThreeBox(
  {
  title,
  description,
  pageLink,
  class_cus
  }
) {
  return (
    <>
    <div className={`box_sec ${class_cus}`}>
		<h2>{title}</h2>
		<p>{description}</p>
		{/* <a href="">{pageLink} === read more  &gt;&gt;</a> */}
    <Link to={pageLink}>read more  &gt;&gt;</Link>
	</div>
    </>
  )
}

export default HomeThreeBox