import { createContext, useCallback, useContext, useEffect, useState } from "react";

import dfs from "../algorithms/dfs";
import dijkstra from "../algorithms/dijkstra";
import kruskal from "../algorithms/kruskal";
import prim from "../algorithms/prim";
import useDebounce from "../hooks/use-debounce";

export const SystemContext = createContext({});

export const useSystemContext = () => {
	const systemContext = useContext(SystemContext);
	if (!systemContext) throw new Error("Something went wrong with the React Context API!");
	return systemContext;
};

export const SystemContextProvider = ({ children }) => {
	const [action, setAction] = useState("NAVIGATING");
	const [algorithm, setAlgorithm] = useState({
		index: 0,
		name: "",
		steps: []
	});
	const [isAlgorithmsGridVisible, setIsAlgorithmsGridVisible] = useState(false);
	const [isGraphDirected, setIsGraphDirected] = useState(false);
	const [isLoaderVisible, setIsLoaderVisible] = useState(true);
	const [network, setNetwork] = useState(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (!network || page === 3) return;

		const edges = network.body.data.edges;
		const nodes = network.body.data.nodes;

		edges.forEach((edge) => {
			edge.color = {
				color: "#9796a1"
			};
			edge.width = 3;
		});

		nodes.forEach((node) => {
			node.color = {
				background: "#9796a1",
				border: "#9796a1"
			};
		});

		network.setData({ nodes, edges });
		setAlgorithm({ index: 0, name: "", steps: [] });
	}, [page]);

	useEffect(() => {
		if (page !== 3) return;

		const interval = setInterval(() => {
			if (algorithm.index >= algorithm.steps.length) return clearInterval(interval);

			visualizeAlgorithmStep(algorithm.index);
			setAlgorithm((prevAlgorithm) => ({
				...prevAlgorithm,
				index: prevAlgorithm.index + 1
			}));
		}, 1000);

		return () => clearInterval(interval);
	}, [algorithm, setAlgorithm, page]);

	const toggleAlgorithmsGrid = useDebounce(
		useCallback(
			(algorithm) => {
				setAlgorithm({ index: 0, name: algorithm.name, steps: algorithm.steps });
				setIsAlgorithmsGridVisible(!isAlgorithmsGridVisible);
			},
			[setAlgorithm, isAlgorithmsGridVisible, setIsAlgorithmsGridVisible]
		),
		500
	);

	const selectAlgorithm = (algorithm) => {
		const algorithmFunctions = {
			DFS: dfs,
			Dijkstra: dijkstra,
			Prim: prim,
			Kruskal: kruskal
		};

		if (!algorithmFunctions[algorithm.name]) return;

		const steps = algorithmFunctions[algorithm.name](network.body.data, isGraphDirected);
		toggleAlgorithmsGrid({ index: 0, name: algorithm.name, steps });
	};

	const visualizeAlgorithmStep = (index) => {
		const step = algorithm.steps[index];
		if (!step) return;

		const edges = network.body.data.edges;
		const nodes = network.body.data.nodes;

		edges.forEach((edge) => {
			edge.color = {
				color: "#9796a1"
			};
			edge.width = 3;
		});

		nodes.forEach((node) => {
			node.color = {
				background: "#9796a1",
				border: "#9796a1"
			};
		});

		Object.values(step.path).forEach((edgeId) => {
			const edge = edges.get(edgeId);
			if (edge) (edge.color = { color: "#000000" }), (edge.width = 5);
		});

		step.visited.forEach((nodeId) => {
			const node = nodes.get(nodeId);
			if (node) node.color = { background: "#000000", border: "#000000" };
		});

		const edge = edges.get(step.edge);
		if (edge) (edge.color = { color: "#3936c8" }), (edge.width = 5);

		const nodeIds = Array.isArray(step.node) ? step.node : [step.node];
		nodeIds.forEach((nodeId) => {
			const node = nodes.get(nodeId);
			if (node) node.color = { background: "#3936c8", border: "#3936c8" };
		});

		network.setData({ edges, nodes });
	};

	const state = {
		// States
		action,
		setAction,
		algorithm,
		setAlgorithm,
		isAlgorithmsGridVisible,
		setIsAlgorithmsGridVisible,
		isGraphDirected,
		setIsGraphDirected,
		isLoaderVisible,
		setIsLoaderVisible,
		network,
		setNetwork,
		page,
		setPage,

		// Functions
		toggleAlgorithmsGrid,
		selectAlgorithm
	};

	return <SystemContext.Provider value={state}>{children}</SystemContext.Provider>;
};
