const prim = (graph) => {
	const minimumSpanningTree = {};
	const steps = [];
	const visited = new Set();

	graph.nodes.forEach((node) => (minimumSpanningTree[node.id] = null));

	const startNode = graph.nodes.getIds()[0];
	const queue = [startNode];
	visited.add(startNode);

	steps.push({
		edge: null,
		node: startNode,
		path: { ...minimumSpanningTree },
		visited: new Set([...visited])
	});

	while (queue.length > 0) {
		let currentEdge = null;
		let currentNode = null;

		graph.edges
			.get({
				filter: (edge) =>
					(visited.has(edge.from) && !visited.has(edge.to)) ||
					(visited.has(edge.to) && !visited.has(edge.from))
			})
			.forEach((edge) => {
				const neighbour = visited.has(edge.from) ? edge.to : edge.from;
				if (!visited.has(neighbour))
					if (currentEdge === null || parseFloat(edge.label) < parseFloat(currentEdge.label))
						(currentEdge = edge), (currentNode = neighbour);
			});

		if (!currentEdge || !currentNode) break;

		minimumSpanningTree[currentNode] = currentEdge.id;
		visited.add(currentNode);

		steps.push({
			edge: currentEdge.id,
			node: currentNode,
			path: { ...minimumSpanningTree },
			visited: new Set([...visited])
		});

		queue.push(currentNode);
	}

	steps.push({
		edge: null,
		node: null,
		path: { ...minimumSpanningTree },
		visited: new Set([...visited])
	});

	return steps;
};

export default prim;
