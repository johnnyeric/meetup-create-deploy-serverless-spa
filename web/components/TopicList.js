import { useTransition, animated } from 'react-spring';
import React from 'react';
import styled from '@emotion/styled';
import Topic from './Topic';
import { css, Global} from '@emotion/core';

const Article = styled.article`
  margin: 0;
  height: 100%;
  width: 100%;
  user-select: none;
  overflow: auto;
  padding: 10px;
  display: flex;
  justify-content: center;
  background: #fffff;
`;

const List = styled.ul`
  list-style: none;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto,
    segoe ui, arial, sans-serif;
  width: 65ch !important;
  height: 100%;

  li {
    position: relative;
    will-change: transform, height, opacity;
    width: 100%;

    div {
      position: relative;
      background-size: cover;
      width: 100%;
      height: 100%;
      overflow: hidden;
      text-transform: uppercase;
      font-size: 10px;
      line-height: 10px;
      padding: 15px;

      div {
        position: relative;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        box-shadow: 0px 10px 25px -10px rgba(0, 0, 0, 0.2);
      }
    }
  }
`;

const Loading = styled.div`
  background: #fff;
  border-top-right-radius: 50px;
  height: 200px;
`;

const Error = styled.div`
  background: red;
  color: #fff;
`;

const TopicList = (props) => {
  const { topics, loading, error } = props;
  const topicsList = topics.map((topic, i) => {
    return {
      ...topic,
      key: i,
      css: 'linear-gradient(125deg, #000000 0%, #b490ca 100%)',
      height: 100
    }
  });

  let height = 0
  const transitions = useTransition(
    topicsList.map(data => ({ ...data, y: (height += data.height) - data.height })),
    d => d.key,
    {
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      update: ({ y, height }) => ({ y, height })
    }
  )

  return (
    <Article>
      <Global
        styles={css`
          * {
            box-sizing: border-box;
          }
          
          html,
          body {
            margin: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            user-select: none;
          }
        `}
      />
      <List style={{ height }}>
        { loading && <Loading /> }
        { error && <Error>{error}</Error> }

        {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
          <animated.li
            key={key}
            style={{ zIndex: topics.length - index, transform: y.interpolate(y => `translate3d(0,${1}px,0)`), ...rest }}>
            <div>
              <div style={{ backgroundImage: item.css }}>
                <Topic topic={item} />
              </div>
            </div>
          </animated.li>
        ))}
      </List>
    </Article>
  )
};

export default TopicList;