import React from 'react';
import { Flex, Spin } from 'antd';

function Loader({
    align, gap, size
}) {
  return (
//     <Flex align="center" gap="middle">
//     {/* <Spin size="small" />
//     <Spin /> */}
//     <Spin size="large" />
//   </Flex>

<Flex align={align} gap={gap}  vertical>
{/* <Spin size="small" />
<Spin /> */}
<Spin size={size} />
</Flex>

  )
}

export default Loader