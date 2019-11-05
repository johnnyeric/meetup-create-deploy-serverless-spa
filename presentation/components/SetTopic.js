import React, { useEffect } from 'react';
import updateTopic from '../utils/updateTopic';

export default ({ topic }) => {
  useEffect(() => {
    try {
      updateTopic(topic);
    } catch(err) {
      console.log(err)
    }
    
  }, [topic]);
  return (
    <></>
  )
}