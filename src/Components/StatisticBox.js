import React from 'react'

const StatisticBox = ({
    // header,
    // body,
    // footerNumber,
    // footerText,
    // borderColor,
    title,
    count,
    class_cus
  }) => {
    return (
        <div className={`bar_box bar_green ${class_cus}`}>
            {/* {title}  */}
            <span>{count}</span>
        </div>
    );
  };

export default StatisticBox