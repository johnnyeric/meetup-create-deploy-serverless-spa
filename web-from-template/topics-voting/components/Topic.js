import styled from '@emotion/styled';

const H1 = styled.h1`
  color: #ffffff;
  display: inline;
  font-size: 1.3em;
  font-weight: 700;
  margin: 0;
  padding: 0;
  text-transform: capitalize;
  word-break: keep-all;
`;

const H3 = styled.h3`
  color: rgb(158, 156, 156);
  display: inline-block;
  font-size: 1.4em;
  font-weight: 400;
  margin: 6px;
  padding: 0;
  text-transform: uppercase;
`;

export default (props) => {
  const { topic } = props;

  return (
    <div>
      <H1>{topic['title']}</H1>
      <H3>{topic['total_votes']}</H3>
    </div>
  );
};