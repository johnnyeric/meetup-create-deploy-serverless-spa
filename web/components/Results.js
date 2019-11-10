import React from 'react';
import styled from '@emotion/styled';

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;

	li {
		display: block;
		height: 3rem;
		width: 100%;
		position: relative;
		padding: 0 1.1rem;
		border: 0.05rem solid #dcdcdc;
		border-radius: 0.2rem;
		background-color: transparent;

		&:not(:last-child) {
			margin-bottom: 0.5rem;
		}
	}
`;

const Result = styled.p`
	float: left;
	margin: 0.7rem 0 0 0;
	font-size: 1.1rem;
	font-family: 'Lato', sans-serif;
	color: #222;
`;
const Counter = styled.p`
	float: right;
	margin: 0.7rem 0 0 0;
	font-size: 1.1rem;
	font-family: 'Lato', sans-serif;
	font-weight: bold;
	color: #86ccc0;
`;

const Results = ({ topics }) => (
	<article>
		<List>
			{topics.map(({ title, total_votes }) => (
				<li>
					<Result>{title}</Result>
					<Counter>{total_votes}</Counter>
				</li>
			))}
		</List>
	</article>
);

export default Results;
