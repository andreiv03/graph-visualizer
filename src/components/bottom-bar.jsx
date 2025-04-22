import { useEffect, useState } from "react";
import { PiArrowCircleLeftDuotone, PiArrowCircleRightDuotone } from "react-icons/pi";

import { NetworkContext } from "../contexts/network-context";
import { useContextHook } from "../hooks/use-context-hook";

import styles from "../styles/components/bottom-bar.module.scss";

export default function BottomBar({ setIsAlgorithmsGridVisible }) {
	const { state, updatePage } = useContextHook(NetworkContext);
	const [isAlgorithmFinished, setIsAlgorithmFinished] = useState(false);

	useEffect(() => {
		const { index, steps } = state.algorithm;
		const isFinished = steps.length && index >= steps.length;
		setIsAlgorithmFinished(isFinished);
	}, [state.algorithm]);

	const getTooltipContext = () => {
		switch (state.page) {
			case 1:
				return `Action: ${state.action}`;

			case 2:
				return `Algorithm: ${state.algorithm.name !== "" ? state.algorithm.name : "None"}`;

			default:
				return "Visualizing...";
		}
	};

	return (
		<div className={styles.bottom_bar}>
			<button disabled={state.page <= 1} onClick={() => updatePage(state.page - 1)}>
				<PiArrowCircleLeftDuotone />
			</button>

			<div
				className={`${styles.tooltip} ${state.page === 2 ? styles.algorithm : ""}`}
				onClick={() => state.page === 2 && setIsAlgorithmsGridVisible(true)}
			>
				<h4>{isAlgorithmFinished ? "The algorithm has finished" : getTooltipContext()}</h4>
			</div>

			<button
				disabled={state.page >= 3 || (state.page === 2 && !state.algorithm.name)}
				onClick={() => updatePage(state.page + 1)}
			>
				<PiArrowCircleRightDuotone />
			</button>
		</div>
	);
}
