import React from 'react'

function Anouncement() {
  return (
    <>
    <div className="anouncement">
	<div className="title"><i className="fa fa-bullhorn" aria-hidden="true"></i> Election Results</div>
	<div className="scroll_sec">
		<marquee className="marq" direction="left" loop="">
			Election 2019  Sample Text Sample Text  |   Results  Sample Text Sample Text   | Miscellaneous Sample Text Sample Text  |   Results  Sample Text Sample Text   | Miscellaneous Sample Text Sample Text  |   Results  Sample Text Sample Text   | Miscellaneous Sample Text Sample Text
		</marquee>
		</div>
	<a href="#" className="link_view">View All</a>
	</div>
    </>
  )
}

export default Anouncement