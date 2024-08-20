const kruskal = (graph) => {
	const minimumSpanningTree = [];
	const parent = {};
	const rank = {};
	const steps = [];
	const visited = new Set();

	graph.nodes.forEach((node) => (parent[node.id] = node.id), (rank[node.id] = 0));

	const find = (node) => {
		if (parent[node] !== node) parent[node] = find(parent[node]);
		return parent[node];
	};

	const union = (from, to) => {
		const rootFrom = find(from);
		const rootTo = find(to);
		if (rootFrom !== rootTo) parent[rootTo] = rootFrom;
	};

	const edges = graph.edges.get().sort((a, b) => parseFloat(a.label) - parseFloat(b.label));

	for (const edge of edges) {
		if (find(edge.from) !== find(edge.to)) {
			minimumSpanningTree.push(edge.id);
			union(edge.from, edge.to);

			visited.add(edge.from);
			visited.add(edge.to);

			steps.push({
				edge: edge.id,
				node: [edge.from, edge.to],
				path: [...minimumSpanningTree],
				visited: new Set([...visited])
			});
		}
	}

	steps.push({
		edge: null,
		node: null,
		path: [...minimumSpanningTree],
		visited: new Set([...visited])
	});

	return steps;
};

export default kruskal;
