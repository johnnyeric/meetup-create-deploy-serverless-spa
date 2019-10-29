import React, { useEffect } from 'react';
import updateTopic from '../utils/updateTopic';

export default ({ topic }) => {
  useEffect(() => {
    updateTopic(topic);
  }, [topic]);
  return (
    <></>
  )
}