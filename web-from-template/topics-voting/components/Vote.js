import React from 'react';
import styled from '@emotion/styled';

const CurrentTopic = styled.p`
	width: 100%;
	text-align: center;
	font-size: 1.6rem;
	font-family: 'Habibi', serif;
	color: #222;
	margin: 1.4rem 0 1.1rem 0;
`;

const Button = styled.button`
	display: block;
	height: 3rem;
	width: 100%;
	position: relative;
	text-align: left;
	border: 0.05rem solid #dcdcdc;
	border-radius: 0.2rem;
	margin-bottom: 0.5rem;
	font-size: 1.1rem;
	font-family: 'Lato', sans-serif;
	transition: padding-left 200ms;
	padding-left: ${({ isSelected }) => (isSelected ? `1.5rem` : `1rem`)};
	font-weight: ${({ isSelected }) => (isSelected ? `bold` : `initial`)};
	background: transparent;

	::after {
		content: '';
		position: absolute;
		height: 100%;
		width: 0.5rem;
		top: 0;
		left: -0.25rem;
		border-radius: 0.2rem 0 0 0.2rem;
		background: #77b8af;
		transition: transform 200ms;
		transform: ${({ isSelected }) =>
			isSelected ? `scaleX(1) translateX(50%)` : `scaleX(0)`};
	}
`;

const Text = styled.p`
	margin: 0;
	float: left;
`;

const Number = styled.p`
	margin: 0;
	float: right;
`;

const VOTE_OPTIONS = [
	{ text: 'Good-ish', number: 1 },
	{ text: 'Good', number: 2 },
	{ text: 'Great!', number: 3 },
	{ text: 'Amazing!!!', number: 5 },
];

export default ({ setAnswer, selectedAnswer, currentTopic }) => {
	return (
		<>
			<CurrentTopic>
				Current Topic: {currentTopic && currentTopic.title}
			</CurrentTopic>

			{VOTE_OPTIONS.map(({ text, number }, i) => (
				<Button
					isSelected={selectedAnswer === VOTE_OPTIONS[i].number}
					key={i}
					onClick={() => setAnswer(VOTE_OPTIONS[i].number)}>
					<Text>{text}</Text>
					<Number>+{number}</Number>
				</Button>
			))}
		</>
	);
};
