import { SubscriptionClient } from 'subscriptions-transport-ws';
import get from 'lodash/get';
import React, { useState, useEffect } from 'react';
import useQuestion from '../utils/use-question-hook';
import WebSocket from 'ws';

const wsclient = new SubscriptionClient(
  'wss://serene-sea-87604.herokuapp.com/v1/graphql',
  { reconnect: true },
  typeof window === 'undefined' ? WebSocket : window.WebSocket
);

export default ({ question }) => {
  const [questions, setQuestions] = useState([]);
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
    }).subscribe({
      next: (data) => {
        setQuestions(get(data, 'data.meetup_question_with_answers', []));
      },
      error: (errors) => {
        console.error('errors', JSON.stringify(errors));
      },
    });
  }, [question]);

  const title = get(questions, '[0].title', get(questionResponse, 'title'));
  const option1 = get(questions, '[0].option1', get(questionResponse, 'option1'));
  const option2 = get(questions, '[0].option2', get(questionResponse, 'option2'))
  const answer1 = questions && questions[0] && questions.filter(q => q.answer === 1)[0];
  const answer2 = questions && questions[0] && questions.filter(q => q.answer === 2)[0];
  const count1 = (answer1 && answer1.count) || 0;
  const count2 = (answer2 && answer2.count) || 0;
  const totalCount = count1 + count2;
  const p1 = answer1 && parseFloat(count1 / totalCount * 100).toFixed(2);
  const p2 = answer2 && parseFloat(count2 / totalCount * 100).toFixed(2);

  return (
    <>
      <span>{title}</span>
      <br/>
      <span>{option1} { p1 || 0 } %</span>
      <span>{option2} { p2 || 0 } %</span>
    </>
  )
}