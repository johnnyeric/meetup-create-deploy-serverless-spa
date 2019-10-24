import { css } from '@emotion/core';
import join from 'proper-url-join';
import Link from 'next/link';
import React from 'react';
import styled from '@emotion/styled';
import withGraphQL from '../lib/withGraphQL';
import gql from 'graphql-tag';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import TopicList from '../components/TopicList';
import get from 'lodash/get';

const BASE_URL = process.env.BASE_URL;

const GET_CURRENT_PRESENTATION = gql`
  query {
    meetup_presentation(limit: 1, order_by: {created_at: desc}) {
      id
      topic {
        id
        title
      }
    }
  }
`;

const GET_TOPICS = gql`
  subscription {
    meetup_topic_with_votes(order_by: {total_votes: desc}) {
      id
      title
      total_votes
    }
  }
`;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 400px;
`;

export default withGraphQL(() => {
  const { data: currentPresentation } = useQuery(GET_CURRENT_PRESENTATION);
  const { data, loading } = useSubscription(GET_TOPICS);

  const currentTopic = get(currentPresentation, 'meetup_presentation[0].topic');
  const topics = get(data, 'meetup_topic_with_votes' , []);

  return (
    <>
      <div>
        <Wrapper>
          <Link href='/about' as={join(BASE_URL,'/about')}><a>About</a></Link>
          <div>Current Topic: {currentTopic && currentTopic.title }</div>
          {loading &&  (<>Loading...</>)}
        </Wrapper>
        <TopicList topics={topics} />
      </div>
    </>
  );
});