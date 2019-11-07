import React, { useEffect } from 'react';
import updateTopicAndQuestion from '../utils/updateTopicAndQuestion';

export default ({ topic, question }) => {
  useEffect(() => {
    try {
      updateTopicAndQuestion(topic, question);
    } catch(err) {
      console.log(err)
    }
    
  }, [topic, question]);
  return (
    <></>
  )
}