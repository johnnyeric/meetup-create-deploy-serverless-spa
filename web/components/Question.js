import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const CurrentQuestion = styled.p`
	width: 100%;
	text-align: center;
	font-size: 1.3rem;
	font-family: 'Habibi', serif;
	color: #222;
	margin: 0 0 1.1rem 0;
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
	background-color: white;
	font-weight: ${({ isSelected }) => (isSelected ? `bold` : `initial`)};

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

const Wrapper = styled.div`
	padding: 1.1rem;
	border: 0.05rem solid #b2b1b1;
	margin-bottom: 1.1rem;
`;

const ThanksText = styled.p`
	margin: 0;
	text-align: center;
	width: 100%;
	font-size: 1.3rem;
	font-family: 'Habibi', serif;
`;

const CTAWrapper = styled.div`
	width: 100%;
	height: 3rem;
`;

const CTA = styled.button`
	height: 100%;
	padding: 0 1.1rem;
	float: right;
	background: #77b8af;
	font-size: 1.1rem;
	font-family: 'Lato', sans-serif;
	color: white;
	border-style: none;
	border-radius: 0.2rem;

	:active {
		background-color: #60968f;
		transition: background-color 200ms;
	}
`;

export default ({ handleAnswer, currentQuestion }) => {
	const [showQuestion, setShowQuestion] = useState(false);
	const [answeredRecently, setAnsweredRecently] = useState(false);
	const [selectedAnswer, setAnswer] = useState(1);

	useEffect(() => {
		setShowQuestion(true);
	}, [currentQuestion]);

	const handleOnClick = async () => {
		setAnsweredRecently(true);
		setShowQuestion(false);
		await handleAnswer({
			variables: { answer: selectedAnswer },
		});
		setTimeout(() => {
			setAnsweredRecently(false);
		}, 1500);
	};

	if (answeredRecently) {
		return (
			<Wrapper>
				<ThanksText> Thanks for answering! </ThanksText>
			</Wrapper>
		);
	}

	return (
		<>
			{showQuestion && currentQuestion && (
				<Wrapper>
					<CurrentQuestion>{currentQuestion.title}</CurrentQuestion>
					<Button
						isSelected={selectedAnswer === 1}
						onClick={() => setAnswer(1)}>
						{currentQuestion && currentQuestion.option1}
					</Button>
					<Button
						isSelected={selectedAnswer === 2}
						onClick={() => setAnswer(2)}>
						{currentQuestion && currentQuestion.option2}
					</Button>
					<CTAWrapper>
						<CTA onClick={handleOnClick}>Submit answer</CTA>
					</CTAWrapper>
				</Wrapper>
			)}
		</>
	);
};
