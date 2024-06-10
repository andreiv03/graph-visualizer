import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemContext } from "../contexts/system.context";
import algorithms from "../data/algorithms.json";
import useDebounce from "../hooks/use-debounce";
import styles from "../styles/components/algorithms-grid.module.scss";

const AlgorithmsGrid = () => {
	const systemContext = useSystemContext();

	useEffect(() => {
		const timer = setTimeout(() => systemContext.setIsAlgorithmsGridVisible(false), 3000);
		return () => clearTimeout(timer);
	}, []);

	const handleChooseAlgorithm = (algorithm) => {
		systemContext.setAlgorithm(algorithm.name);
		systemContext.setIsAlgorithmsGridVisible(false);
	};

	const debouncedHandleChooseAlgorithm = useDebounce(handleChooseAlgorithm, 1500);

	return (
		<AnimatePresence>
			{systemContext.isAlgorithmsGridVisible ? (
				<>
					<motion.div
						className={styles.overlay}
						key="overlay"
						onClick={systemContext.debouncedHandleToggleGrid}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>

					<motion.div
						className={styles.grid}
						key="grid"
						initial={{ opacity: 0, x: "calc(-50% - 1rem)", y: "calc(-50% - 200px)" }}
						animate={{ opacity: 1, x: "calc(-50% - 1rem)", y: "-50%" }}
						exit={{ opacity: 0, x: "calc(-50% - 1rem)", y: "calc(-50% + 200px)" }}
						transition={{ duration: 0.5, type: "spring" }}
					>
						{algorithms.map((algorithm) => (
							<div
								className={styles.card}
								key={algorithm.name}
								onClick={() => debouncedHandleChooseAlgorithm(algorithm)}
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

									<button>Choose algorithm</button>
								</div>
							</div>
						))}
					</motion.div>
				</>
			) : null}
		</AnimatePresence>
	);
};

export default AlgorithmsGrid;
