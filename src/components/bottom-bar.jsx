import {
	PiArrowCircleLeftDuotone,
	PiArrowCircleRightDuotone,
	PiArrowClockwiseDuotone,
} from "react-icons/pi";

import { NetworkContext } from "../contexts/network-context";
import { useContextHook } from "../hooks/use-context-hook";

import styles from "../styles/components/bottom-bar.module.scss";

export default function BottomBar({ setIsAlgorithmsGridVisible }) {
	const { state, setAlgorithmIndex, updatePage } = useContextHook(NetworkContext);

	const isLeftArrowDisabled = state.page === 3 ? state.algorithm.index <= 0 : state.page <= 1;

	const isRightArrowDisabled =
		state.page === 3
			? state.algorithm.index >= state.algorithm.steps.length - 1
			: state.page >= 3 || (state.page === 2 && !state.algorithm.name);

	const handleLeftArrow = () => {
		if (state.page === 3) {
			setAlgorithmIndex(state.algorithm.index - 1);
		} else {
			updatePage(state.page - 1);
		}
	};

	const handleRightArrow = () => {
		if (state.page === 3) {
			setAlgorithmIndex(state.algorithm.index + 1);
		} else {
			updatePage(state.page + 1);
		}
	};

	const getTooltipContext = () => {
		switch (state.page) {
			case 1:
				return `Action: ${state.action}`;

			case 2:
				return `Algorithm: ${state.algorithm.name !== "" ? state.algorithm.name : "None"}`;

			case 3:
				return `Algorithm step: ${state.algorithm.index + 1}/${state.algorithm.steps.length}`;
		}
	};

	return (
		<div className={styles.bottom_bar}>
			<button disabled={isLeftArrowDisabled} onClick={handleLeftArrow}>
				<PiArrowCircleLeftDuotone />
			</button>

			<div
				className={`${styles.tooltip} ${state.page === 2 ? styles.algorithm : ""}`}
				onClick={() => state.page === 2 && setIsAlgorithmsGridVisible(true)}
			>
				<h4>{getTooltipContext()}</h4>
			</div>

			<button disabled={isRightArrowDisabled} onClick={handleRightArrow}>
				<PiArrowCircleRightDuotone />
			</button>

			<button
				className={`${styles.reset} ${state.page === 3 ? styles.visible : ""}`}
				onClick={() => updatePage(1)}
			>
				<PiArrowClockwiseDuotone />
			</button>
		</div>
	);
}
