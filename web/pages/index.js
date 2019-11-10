import { css, Global } from '@emotion/core';
import { useMutation, useSubscription } from '@apollo/react-hooks';
import get from 'lodash/get';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Results, Vote, Question, Loading } from '../components';
import withGraphQL from '../lib/withGraphQL';

const GET_CURRENT_PRESENTATION = gql`
	subscription {
		meetup_presentation(limit: 1, order_by: { created_at: desc }) {
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

const GET_TOPICS = gql`
	subscription {
		meetup_topic_with_votes(order_by: { total_votes: desc }) {
			id
			title
			total_votes
		}
	}
`;

const ANSWER = gql`
	mutation insert_meetup_answer($answer: Int) {
		insert_meetup_answer(objects: { answer: $answer }) {
			returning {
				id
				answer
			}
		}
	}
`;

const VOTE = gql`
	mutation insert_meetup_vote($count: Int) {
		insert_meetup_vote(objects: { vote: $count }) {
			returning {
				vote
				id
			}
		}
	}
`;

const Tabs = styled.div`
	display: flex;
	background-color: #dcdcdc;
`;

const Tab = styled.button`
	width: 100%;
	height: 100%;
	align-content: center;
	font-size: 1.8rem;
	font-family: 'Habibi', serif;
	color: #222;
	border-style: none;
	background-color: ${({ isSelected }) => (isSelected ? `#fff` : '#dcdcdc')};

	flex: 1;
	height: 4rem;

	:first-of-type {
		border-radius: ${({ isSelected }) => (isSelected ? `0 1rem 0 0` : '0')};
	}

	:last-of-type {
		border-radius: ${({ isSelected }) => (isSelected ? `1rem 0 0 0` : '0')};
	}
`;

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const MainWrapper = styled.div`
	width: 100%;
	margin: 0;
	box-shadow: 0.1rem 0.1rem 0.5rem 0 rgba(34, 34, 34, 0.5);

	@media (min-width: 44rem) {
		width: 44rem;
		margin: 4rem 0;
	}
`;

const ContentWrapper = styled.div`
	padding: 0.5rem;
	background: white;

	@media (min-width: 44rem) {
		padding: 2.5rem;
	}
`;

const CTAWrapper = styled.div`
	width: 100%;
	height: 3rem;
	background: white;
`;

const CTA = styled.button`
	width: 100%;
	height: 100%;
	border-style: none;
	background: #77b8af;
	font-size: 1.1rem;
	font-family: 'Lato', sans-serif;
	color: white;

	:not(disabled) {
		:active {
			transition: background-color 200ms;
			background-color: #60968f;
		}
	}
`;

export default withGraphQL(() => {
	const [showVoting, setShowVoting] = useState(false);

	const {
		data: currentPresentation,
		loading: isPresentationLoading,
	} = useSubscription(GET_CURRENT_PRESENTATION);

	const { data, loading: areTopicsLoading } = useSubscription(GET_TOPICS);

	const [vote] = useMutation(VOTE);
	const [answer] = useMutation(ANSWER);

	const currentTopic = get(
		currentPresentation,
		'meetup_presentation[0].topic'
	);
	const currentQuestion = get(
		currentPresentation,
		'meetup_presentation[0].question'
	);
	const topics = get(data, 'meetup_topic_with_votes', []);

	//@TODO: The idea is to move this to Vote and provide `handleVoting` to it
	const VOTE_OPTIONS = [
		{ text: 'Good-ish', number: 1 },
		{ text: 'Good', number: 2 },
		{ text: 'Great!', number: 3 },
		{ text: 'Amazing!!!', number: 5 },
	];
	const [selectedAnswer, setAnswer] = useState(VOTE_OPTIONS[0].number);
	const [votedRecently, setVotedRecently] = useState(false);
	const handleOnClick = async () => {
		setVotedRecently(true);
		await vote({ variables: { count: selectedAnswer } });
		setTimeout(() => {
			setVotedRecently(false);
		}, 1500);
	};

	return (
		<Main>
			<Global
				styles={css`
					* {
						box-sizing: border-box;

						&:focus {
							outline: none;
						}
					}

					html,
					body {
						margin: 0;
						width: 100%;
						height: 100%;
						user-select: none;
						background-image: url('../static/background.jpg');
						background-size: cover;
					}
				`}
			/>

			<MainWrapper>
				<Tabs>
					<Tab
						isSelected={!showVoting}
						onClick={() => setShowVoting(false)}>
						Results
					</Tab>

					<Tab
						isSelected={showVoting}
						onClick={() => setShowVoting(true)}>
						Vote
					</Tab>
				</Tabs>

				<ContentWrapper>
					{isPresentationLoading || areTopicsLoading ? (
						<Loading />
					) : (
						<>
							{showVoting && (
								<>
									<Question
										handleAnswer={answer}
										currentQuestion={currentQuestion}
									/>
									<Vote
										setAnswer={setAnswer}
										selectedAnswer={selectedAnswer}
										currentTopic={currentTopic}
									/>
								</>
							)}
							{!showVoting && <Results topics={topics} />}
						</>
					)}
				</ContentWrapper>

				{showVoting && !(isPresentationLoading || areTopicsLoading) && (
					<CTAWrapper>
						<CTA disabled={votedRecently} onClick={handleOnClick}>
							{votedRecently
								? 'Thanks for voting!'
								: 'Submit your vote'}
						</CTA>
					</CTAWrapper>
				)}
			</MainWrapper>
		</Main>
	);
});
