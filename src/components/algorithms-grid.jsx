import { AnimatePresence, motion } from "framer-motion";

import { NetworkContext } from "../contexts/network-context";
import algorithms from "../data/algorithms.json";
import { useContextHook } from "../hooks/use-context-hook";
import { getGraphConditions } from "../utils/helpers";

import styles from "../styles/components/algorithms-grid.module.scss";

export default function AlgorithmsGrid({ isAlgorithmsGridVisible, setIsAlgorithmsGridVisible }) {
	const { state, setAlgorithm } = useContextHook(NetworkContext);

	const conditions = getGraphConditions(state.network, state.isGraphDirected);

	const getFailedConditions = (algorithm) =>
		algorithm.conditions.filter((condition) => !conditions[condition]?.());

	const selectAlgorithm = (algorithm) => {
		setAlgorithm(algorithm);
		setIsAlgorithmsGridVisible(false);
	};

	return (
		<AnimatePresence>
			{isAlgorithmsGridVisible && (
				<>
					<motion.div
						className={styles.overlay}
						key="overlay"
						onClick={() => selectAlgorithm({ index: 0, name: "", steps: [] })}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>

					<motion.div
						className={styles.grid}
						key="grid"
						initial={{ opacity: 0, x: "calc(-50% - 1rem)", y: "calc(-50% - 200px)" }}
						animate={{ opacity: 1, x: "calc(-50% - 1rem)", y: "calc(-50% - 1rem)" }}
						exit={{ opacity: 0, x: "calc(-50% - 1rem)", y: "calc(-50% + 200px)" }}
						transition={{ duration: 0.5, type: "spring" }}
					>
						{algorithms.map((algorithm) => {
							const failedConditions = getFailedConditions(algorithm);

							return (
								<button
									className={styles.card}
									key={algorithm.name}
									disabled={failedConditions.length > 0}
									onClick={() => selectAlgorithm(algorithm)}
								>
									<div className={styles.details}>
										<h3>{algorithm.name}</h3>
										<h4>{algorithm.complexity}</h4>
										<p>{algorithm.description}</p>
									</div>

									<div className={styles.row}>
										<div className={styles.tags}>
											{algorithm.tags.map((tag) => (
												<span key={tag}>{tag}</span>
											))}
										</div>

										<div className={styles.choose_algorithm}>Choose algorithm</div>
									</div>

									{failedConditions.length > 0 && (
										<div className={styles.failed_conditions}>
											<h5>Failed conditions</h5>
											<ul>
												{failedConditions.map((condition) => (
													<li key={condition}>{condition}</li>
												))}
											</ul>
										</div>
									)}
								</button>
							);
						})}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
