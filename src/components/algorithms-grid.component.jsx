import { AnimatePresence, motion } from "framer-motion";

import { useSystemContext } from "../contexts/system.context";
import algorithms from "../data/algorithms.json";

import styles from "../styles/components/algorithms-grid.module.scss";

const getConditions = (network, isGraphDirected) => ({
	"non-negative weights": () => !network.body.data.edges.get().some((edge) => edge.label < 0),
	"weighted graph": () => !network.body.data.edges.get().some((edge) => edge.label === undefined),
	"unweighted graph": () => !network.body.data.edges.get().some((edge) => edge.label !== undefined),
	"directed graph": () => isGraphDirected,
	"undirected graph": () => !isGraphDirected,
	"connected graph": () => {
		const edges = network.body.data.edges.get();
		const nodes = network.body.data.nodes.get();
		const adjacencyList = new Map(nodes.map((node) => [node.id, []]));
		const visited = new Set();

		edges.forEach((edge) => {
			adjacencyList.get(edge.from).push(edge.to);
			if (!isGraphDirected) adjacencyList.get(edge.to).push(edge.from);
		});

		const dfs = (node) => {
			visited.add(node);
			adjacencyList.get(node).forEach((neighbor) => {
				if (!visited.has(neighbor)) dfs(neighbor);
			});
		};

		dfs(nodes[0].id);
		return visited.size === nodes.length;
	}
});

const AlgorithmsGrid = () => {
	const {
		isAlgorithmsGridVisible,
		isGraphDirected,
		network,
		toggleAlgorithmsGrid,
		selectAlgorithm
	} = useSystemContext();

	const checkIfConditionsAreMet = (algorithm) => {
		const conditions = getConditions(network, isGraphDirected);
		return algorithm.conditions.every((condition) => conditions[condition]());
	};

	return (
		<AnimatePresence>
			{isAlgorithmsGridVisible && (
				<>
					<motion.div
						className={styles.overlay}
						key="overlay"
						onClick={() => toggleAlgorithmsGrid({ index: 0, name: "", steps: [] })}
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
						{algorithms.map((algorithm) => (
							<button
								className={styles.card}
								key={algorithm.name}
								disabled={!checkIfConditionsAreMet(algorithm)}
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
							</button>
						))}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default AlgorithmsGrid;
