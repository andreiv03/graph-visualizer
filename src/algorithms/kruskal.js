import { createStepLogger } from "../utils/helpers";

const kruskal = (graph) => {
	const steps = [];
	const mstEdges = [];
	const visited = new Set();
	const parent = {};
	const rank = {};

	const nodes = graph.nodes.get();
	const edges = graph.edges.get().sort((a, b) => parseFloat(a.label) - parseFloat(b.label));
	const logStep = createStepLogger({ steps, path: mstEdges, visited });

	nodes.forEach(({ id }) => {
		parent[id] = id;
		rank[id] = 0;
	});

	const find = (nodeId) => {
		if (parent[nodeId] !== nodeId) {
			parent[nodeId] = find(parent[nodeId]);
		}

		return parent[nodeId];
	};

	const union = (a, b) => {
		const rootA = find(a);
		const rootB = find(b);

		if (rootA === rootB) {
			return;
		}

		if (rank[rootA] < rank[rootB]) {
			parent[rootA] = rootB;
		} else if (rank[rootA] > rank[rootB]) {
			parent[rootB] = rootA;
		} else {
			parent[rootB] = rootA;
			rank[rootA]++;
		}
	};

	for (const edge of edges) {
		const { from, to, id } = edge;

		if (find(from) !== find(to)) {
			mstEdges.push(id);
			union(from, to);

			visited.add(from);
			visited.add(to);

			logStep({ edge: id, node: to });
		}
	}

	logStep({});
	return steps;
};

export default kruskal;
