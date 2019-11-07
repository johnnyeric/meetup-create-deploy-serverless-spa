import { useState, useEffect } from 'react';
const graphql = require('graphql.js');

const endpoint = 'https://serene-sea-87604.herokuapp.com/v1/graphql';
const graph = graphql(endpoint, {
  asJSON: true
});

const getQuestion = graph(`
  query meetup_question($id: uuid) {
    meetup_question(where: {id: {_eq: $id}}) {
      id
      option1
      option2
      title
    }
  }
`);

export default (questionId) => {
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const fetchQuestion = async () => {
      const questionResponse = await getQuestion({ id: questionId });
      setQuestion(questionResponse.meetup_question[0]);
    }

    fetchQuestion();
  }, [questionId]);

  return question;
}