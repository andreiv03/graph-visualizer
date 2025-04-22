import { createStepLogger } from "../utils/helpers";

const prim = (graph) => {
	const steps = [];
	const mstEdges = {};
	const visited = new Set();

	const nodes = graph.nodes.get();
	const edges = graph.edges.get();
	const nodeIds = graph.nodes.getIds();
	const logStep = createStepLogger({ steps, path: mstEdges, visited });

	const startNode = nodeIds[0];
	mstEdges[startNode] = null;
	visited.add(startNode);

	logStep({ node: startNode });

	while (visited.size < nodes.length) {
		let minEdge = null;
		let nextNode = null;

		for (const edge of edges) {
			const { from, to, label } = edge;
			const fromVisited = visited.has(from);
			const toVisited = visited.has(to);

			if (fromVisited !== toVisited) {
				const neighbor = fromVisited ? to : from;
				const weight = parseFloat(label);

				if (!visited.has(neighbor)) {
					if (!minEdge || weight < parseFloat(minEdge.label)) {
						minEdge = edge;
						nextNode = neighbor;
					}
				}
			}
		}

		if (!minEdge || !nextNode) {
			break;
		}

		mstEdges[nextNode] = minEdge.id;
		visited.add(nextNode);
		logStep({ edge: minEdge.id, node: nextNode });
	}

	logStep({});
	return steps;
};

export default prim;
