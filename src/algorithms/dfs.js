const dfs = (graph, isGraphDirected) => {
	const path = {};
	const steps = [];
	const visited = new Set();

	graph.nodes.forEach((node) => (path[node.id] = null));

	const dfsRecursive = (node) => {
		visited.add(node);

		steps.push({
			edge: null,
			node,
			path: { ...path },
			visited: new Set([...visited])
		});

		graph.edges
			.get({
				filter: (edge) =>
					isGraphDirected ? edge.from === node : edge.from === node || edge.to === node
			})
			.forEach((edge) => {
				const neighbour = edge.from === node ? edge.to : edge.from;
				if (!visited.has(neighbour)) {
					path[neighbour] = edge.id;

					steps.push({
						edge: edge.id,
						node: neighbour,
						path: { ...path },
						visited: new Set([...visited])
					});

					dfsRecursive(neighbour);
				}
			});
	};

	dfsRecursive(graph.nodes.getIds()[0]);

	steps.push({
		edge: null,
		node: null,
		path: { ...path },
		visited: new Set([...visited])
	});

	return steps;
};

export default dfs;
