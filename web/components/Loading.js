import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';

const loadingKeyframes = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const StyledLoading = styled.div`
	display: block;
	margin: auto;
	position: relative;
	width: 64px;
	height: 64px;

	div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 51px;
		height: 51px;
		margin: 6px;
		border: 6px solid #b2b1b1;
		border-radius: 50%;
		animation: ${loadingKeyframes} 1.2s cubic-bezier(0.5, 0, 0.5, 1)
			infinite;
		border-color: #b2b1b1 transparent transparent transparent;
	}

	div:nth-of-type(1) {
		animation-delay: -0.45s;
	}

	div:nth-of-type(2) {
		animation-delay: -0.3s;
	}

	div:nth-of-type(3) {
		animation-delay: -0.15s;
	}
`;

const Loading = () => (
	<StyledLoading>
		<div></div>
		<div></div>
		<div></div>
		<div></div>
	</StyledLoading>
);

export default Loading;
