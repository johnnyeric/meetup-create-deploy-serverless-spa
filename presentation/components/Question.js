import React, { useState, useEffect } from 'react';
import { SubscriptionClient } from 'subscriptions-transport-ws';
const WebSocket = require('ws');

const wsclient = new SubscriptionClient(
  'wss://serene-sea-87604.herokuapp.com/v1/graphql',
  {
    reconnect: true,
    connectionParams: {
      headers: {},
    },
  },
  typeof window === 'undefined' ? WebSocket : window.WebSocket
);

export default ({ question }) => {
  const [presentation, setPresentation] = useState({});
  useEffect(() => {
    wsclient.request({
      query: `subscription { 
        meetup_presentation {
          id
          topic {
            title
          }
        }
      }`,
      // Don't forget to check for an `errors` property in the next() handler
    }).subscribe({
      next: (data) => {
        setPresentation(data.data.meetup_presentation[0]);
      },
      error: (errors) => {
        console.error('errors', JSON.stringify(errors));
      },
    });
    
  }, []);

  const topic = presentation && presentation.topic && presentation.topic.title;

  return (
    <>
      <span>Hello</span>
      <span>Topic { topic }</span>
    </>
  )
}