import React, { useState, useEffect } from 'react';
import useQuestion from '../utils/use-question-hook';
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
  const [questions, setQuestions] = useState({});
  const questionResponse = useQuestion(question);
  useEffect(() => {
    wsclient.request({
      query: `subscription ($question_id: uuid) {
        meetup_question_with_answers (where: {id: {_eq: $question_id}}){
          id
          title
          option1
          option2
          answer
          count
        }
      }`,
      variables: {
        question_id: question
      }
      // Don't forget to check for an `errors` property in the next() handler
    }).subscribe({
      next: (data) => {
        setQuestions(data.data.meetup_question_with_answers);
      },
      error: (errors) => {
        console.error('errors', JSON.stringify(errors));
      },
    });
    
  }, [question]);

  const title = questionResponse && questionResponse.title;
  const option1 = questionResponse && questionResponse.option1;
  const option2 = questionResponse && questionResponse.option2;
  const answer1 = questions && questions[0] && questions.filter(q => q.answer === 1)[0];
  const answer2 = questions && questions[0] && questions.filter(q => q.answer === 2)[0];
  const totalCount = (answer1 && answer1.count) + (answer2 && answer2.count);
  const p1 = answer1 && parseFloat((answer1 && answer1.count) / totalCount * 100).toFixed(2);
  const p2 = answer2 && parseFloat((answer2 && answer2.count) / totalCount * 100).toFixed(2);

  return (
    <>
      <span>Quiz: {title} </span>
      <br />
      <span>{option1} { p1 || 0 } %</span>
      <br />
      <span>{option2} { p2 || 0 } %</span>
    </>
  )
}