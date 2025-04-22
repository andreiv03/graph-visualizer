import { createStepLogger } from "../utils/helpers";

const dfs = (graph, isGraphDirected) => {
	const steps = [];
	const path = {};
	const visited = new Set();

	const nodes = graph.nodes.get();
	const edges = graph.edges.get();
	const nodeIds = graph.nodes.getIds();
	const logStep = createStepLogger({ steps, path, visited });

	nodes.forEach(({ id }) => {
		path[id] = null;
	});

	const dfsRecursive = (nodeId) => {
		visited.add(nodeId);
		logStep({ node: nodeId });

		const neighbors = edges.filter((edge) => {
			return isGraphDirected ? edge.from === nodeId : edge.from === nodeId || edge.to === nodeId;
		});

		neighbors.forEach((edge) => {
			const neighborId = edge.from === nodeId ? edge.to : edge.from;

			if (!visited.has(neighborId)) {
				path[neighborId] = edge.id;
				logStep({ edge: edge.id, node: neighborId });
				dfsRecursive(neighborId);
			}
		});
	};

	dfsRecursive(nodeIds[0]);
	logStep({});
	return steps;
};

export default dfs;
