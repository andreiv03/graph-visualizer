import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";

import dfs from "../algorithms/dfs";
import dijkstra from "../algorithms/dijkstra";
import kruskal from "../algorithms/kruskal";
import prim from "../algorithms/prim";
import { resetGraphStyles, visualizeAlgorithmStep } from "../utils/helpers";

export const NetworkContext = createContext(null);

const reducer = (state, action) => {
	switch (action.type) {
		case "INITIALIZE_NETWORK":
			return { ...state, network: action.payload };

		case "SET_ACTION":
			return { ...state, action: action.payload };

		case "SET_ALGORITHM":
			return { ...state, algorithm: action.payload };

		case "SET_ALGORITHM_INDEX":
			return { ...state, algorithm: { ...state.algorithm, index: action.payload } };

		case "TOGGLE_GRAPH_DIRECTED":
			return { ...state, isGraphDirected: action.payload };

		case "UPDATE_PAGE":
			return { ...state, page: action.payload };

		default:
			return state;
	}
};

export function NetworkProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, {
		action: "NAVIGATING",
		algorithm: {
			index: 0,
			name: "",
			steps: [],
		},
		isGraphDirected: false,
		network: null,
		page: 1,
	});

	const initializeNetwork = useCallback((network) => {
		if (!network) {
			return;
		}

		dispatch({ type: "INITIALIZE_NETWORK", payload: network });
	}, []);

	const setAction = useCallback(
		(action) => {
			if (!state.network || !action) {
				return;
			}

			dispatch({ type: "SET_ACTION", payload: action });
		},
		[state.network],
	);

	const setAlgorithm = useCallback(
		(algorithm) => {
			if (!state.network || !algorithm) {
				return;
			}

			const algorithmFunctions = {
				DFS: dfs,
				Dijkstra: dijkstra,
				Prim: prim,
				Kruskal: kruskal,
			};

			if (!algorithmFunctions[algorithm.name]) {
				return;
			}

			const steps = algorithmFunctions[algorithm.name](
				state.network.body.data,
				state.isGraphDirected,
			);

			dispatch({ type: "SET_ALGORITHM", payload: { index: 0, name: algorithm.name, steps } });
		},
		[state.isGraphDirected, state.network],
	);

	const setAlgorithmIndex = useCallback(
		(index) => {
			if (!state.algorithm.steps.length) {
				return;
			}

			if (index < 0 || index >= state.algorithm.steps.length) {
				return;
			}

			visualizeAlgorithmStep(state.network, { ...state.algorithm, index });
			dispatch({ type: "SET_ALGORITHM_INDEX", payload: index });
		},
		[state.algorithm, state.network],
	);

	const toggleGraphDirected = useCallback(() => {
		state.network.setOptions({
			edges: {
				arrows: {
					to: { enabled: !state.isGraphDirected, scaleFactor: 1 },
				},
			},
		});

		dispatch({ type: "TOGGLE_GRAPH_DIRECTED", payload: !state.isGraphDirected });
	}, [state.isGraphDirected, state.network]);

	const updatePage = useCallback(
		(page) => {
			if (!state.network || !state.network.body.data.nodes.length) {
				return;
			}

			state.network.fit();
			state.network.setOptions({
				interaction: {
					dragNodes: page === 1,
					dragView: page === 1,
					selectable: page === 1,
					zoomView: page === 1,
				},
			});

			dispatch({ type: "UPDATE_PAGE", payload: page });
		},
		[state.network],
	);

	useEffect(() => {
		if (!state.network || state.page === 3) {
			return;
		}

		const { edges, nodes } = state.network.body.data;
		resetGraphStyles(edges, nodes);
		state.network.setData({ nodes, edges });

		dispatch({ type: "SET_ALGORITHM", payload: { index: 0, name: "", steps: [] } });
	}, [state.network, state.page]);

	useEffect(() => {
		if (!state.network || state.page !== 3) {
			return;
		}

		visualizeAlgorithmStep(state.network, state.algorithm);
	}, [state.page, state.network, state.algorithm]);

	const contextValue = useMemo(
		() => ({
			state,
			initializeNetwork,
			setAction,
			setAlgorithm,
			setAlgorithmIndex,
			toggleGraphDirected,
			updatePage,
		}),
		[
			state,
			initializeNetwork,
			setAction,
			setAlgorithm,
			setAlgorithmIndex,
			toggleGraphDirected,
			updatePage,
		],
	);

	return <NetworkContext.Provider value={contextValue}>{children}</NetworkContext.Provider>;
}
