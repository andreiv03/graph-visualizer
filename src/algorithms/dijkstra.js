const dijkstra = (graph) => {
	const distances = {};
	const path = {};
	const steps = [];
	const visited = new Set();

	graph.nodes.forEach((node) => ((distances[node.id] = Infinity), (path[node.id] = null)));

	const startNode = graph.nodes.getIds()[0];
	const queue = [startNode];
	distances[startNode] = 0;

	while (queue.length > 0) {
		const node = queue.reduce(
			(smallestNode, node) => (distances[node] < distances[smallestNode] ? node : smallestNode),
			queue[0]
		);

		queue.splice(queue.indexOf(node), 1);
		visited.add(node);

		steps.push({
			edge: null,
			node,
			path: { ...path },
			visited: new Set([...visited])
		});

		graph.edges
			.get({
				filter: (edge) => edge.from === node || edge.to === node
			})
			.forEach((edge) => {
				const neighbour = edge.from === node ? edge.to : edge.from;
				if (visited.has(neighbour)) return;

				steps.push({
					edge: edge.id,
					node,
					path: { ...path },
					visited: new Set([...visited])
				});

				const distance = distances[node] + parseFloat(edge.label);
				if (distance < distances[neighbour]) {
					distances[neighbour] = distance;
					path[neighbour] = edge.id;
					if (!queue.includes(neighbour)) queue.push(neighbour);
				}
			});
	}

	steps.push({
		edge: null,
		node: null,
		path: { ...path },
		visited: new Set([...visited])
	});

	return steps;
};

export default dijkstra;
