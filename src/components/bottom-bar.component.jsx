import { useCallback, useEffect, useState } from "react";
import { PiArrowCircleLeftDuotone, PiArrowCircleRightDuotone } from "react-icons/pi";

import { useSystemContext } from "../contexts/system.context";
import useDebounce from "../hooks/use-debounce";

import styles from "../styles/components/bottom-bar.module.scss";

const BottomBar = () => {
	const [isAlgorithmFinished, setIsAlgorithmFinished] = useState(false);

	const { action, setAction, algorithm, network, page, setPage, toggleAlgorithmsGrid } =
		useSystemContext();

	useEffect(() => {
		if (algorithm.steps.length && algorithm.index >= algorithm.steps.length)
			setIsAlgorithmFinished(true);
		else setIsAlgorithmFinished(false);
	}, [algorithm]);

	const changePage = useDebounce(
		useCallback(
			(page) => {
				if (!network || !network.body.data.nodes.length) return;

				network.fit();
				network.setOptions({
					interaction: {
						dragNodes: page === 1,
						dragView: page === 1,
						selectable: page === 1,
						zoomView: page === 1
					}
				});

				setAction("NAVIGATING");
				setPage(page);
			},
			[setAction, network, setPage]
		),
		1500
	);

	const getTooltipContext = () => {
		if (page === 1) return `Action: ${action}`;
		if (page === 2) return `Algorithm: ${algorithm.name !== "" ? algorithm.name : "None"}`;
		return "Visualizing...";
	};

	return (
		<div className={styles.bottom_bar}>
			<button
				disabled={page <= 1}
				onClick={() => changePage(page - 1)}
			>
				<PiArrowCircleLeftDuotone />
			</button>

			<div
				className={`${styles.tooltip} ${page === 2 ? styles.algorithm : ""}`}
				onClick={() => page === 2 && toggleAlgorithmsGrid({ index: 0, name: "", steps: [] })}
			>
				<h4>{isAlgorithmFinished ? "The algorithm has finished" : getTooltipContext()}</h4>
			</div>

			<button
				disabled={page >= 3 || (page === 2 && !algorithm.name)}
				onClick={() => changePage(page + 1)}
			>
				<PiArrowCircleRightDuotone />
			</button>
		</div>
	);
};

export default BottomBar;
