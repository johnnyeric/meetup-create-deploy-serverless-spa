import { Button } from 'rebass';
import { css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import get from 'lodash/get';
import gql from 'graphql-tag';
import join from 'proper-url-join';
import Link from 'next/link';
import preset from '@rebass/preset';
import React from 'react';
import styled from '@emotion/styled';
import withGraphQL from '../lib/withGraphQL';

const BASE_URL = process.env.BASE_URL;

const GET_CURRENT_PRESENTATION = gql`
  subscription {
    meetup_presentation(limit: 1, order_by: {created_at: desc}) {
      id
      topic {
        id
        title
      }
      question {
        id
        title
        option1
        option2
      }
    }
  }
`;

const VOTE = gql`
  mutation insert_meetup_vote($count: Int){
    insert_meetup_vote(objects: {vote: $count}) {
      returning {
        vote
        id
      }
    }
  }
`;

const ANSWER = gql`
  mutation insert_meetup_answer($answer: Int){
    insert_meetup_answer(objects: {answer: $answer}) {
      returning {
        id
        answer
      }
    }
  }
`;

const theme = {
  ...preset,
}

const Wrapper = styled.div`
  margin: 0 auto;
  width: 400px;
`;

export default withGraphQL(() => {
  const { data: currentPresentation, loading } = useSubscription(GET_CURRENT_PRESENTATION);
  const [vote] = useMutation(VOTE);
  const [answer] = useMutation(ANSWER);

  const currentTopic = get(currentPresentation, 'meetup_presentation[0].topic');
  const currentQuestion = get(currentPresentation, 'meetup_presentation[0].question');

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Wrapper>
          <Link href='/' as={join(BASE_URL,'/')}><a>Topic List</a></Link>
          <div>Current Topic: {currentTopic && currentTopic.title }</div>
          {loading &&  (<>Loading...</>)}
          <br />
          <Button variant='primary' mr={3} onClick={async () => await vote({ variables: { count: 1 }})}>
            +1
          </Button>
          <Button variant='primary' mr={3} onClick={async () => await vote({ variables: { count: 2 }})}>
            +2
          </Button>
          <Button variant='primary' mr={3} onClick={async () => await vote({ variables: { count: 3 }})}>
            +3
          </Button>
          <Button variant='primary' mr={3} onClick={async () => await vote({ variables: { count: 5 }})}>
            +5
          </Button>
          <Button variant='primary' mr={3} onClick={async () => await vote({ variables: { count: 8 }})}>
            +8
          </Button>

          <br />
          <br />
          <br />
          { currentQuestion && (
            <>
              <div>Current Question: {currentQuestion && currentQuestion.title }</div>
              <Button variant='primary' mr={3} onClick={async () => await answer({ variables: { answer: 1 }})}>
                {currentQuestion && currentQuestion.option1}
              </Button>
              <Button variant='primary' mr={3} onClick={async () => await answer({ variables: { answer: 2 }})}>
                {currentQuestion && currentQuestion.option2}
              </Button>
            </>
          )}
          
        </Wrapper>
      </div>
    </ThemeProvider>
  );
});