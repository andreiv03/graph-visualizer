import { createStepLogger } from "../utils/helpers";

const dijkstra = (graph, isGraphDirected) => {
	const distances = {};
	const path = {};
	const steps = [];
	const visited = new Set();

	const nodes = graph.nodes.get();
	const edges = graph.edges.get();
	const nodeIds = graph.nodes.getIds();
	const logStep = createStepLogger({ steps, path, visited });

	const startNode = nodeIds[0];

	nodes.forEach(({ id }) => {
		distances[id] = Infinity;
		path[id] = null;
	});

	distances[startNode] = 0;
	const queue = [startNode];

	while (queue.length > 0) {
		const currentNode = queue.reduce((minNode, n) =>
			distances[n] < distances[minNode] ? n : minNode,
		);

		queue.splice(queue.indexOf(currentNode), 1);
		visited.add(currentNode);
		logStep({ node: currentNode });

		const connectedEdges = edges.filter((edge) => {
			return isGraphDirected
				? edge.from === currentNode
				: edge.from === currentNode || edge.to === currentNode;
		});

		for (const edge of connectedEdges) {
			const neighbor = edge.from === currentNode ? edge.to : edge.from;

			if (visited.has(neighbor)) {
				continue;
			}

			logStep({ edge: edge.id, node: currentNode });

			const edgeWeight = parseFloat(edge.label);
			const nextDistance = distances[currentNode] + edgeWeight;

			if (nextDistance < distances[neighbor]) {
				distances[neighbor] = nextDistance;
				path[neighbor] = edge.id;

				if (!queue.includes(neighbor)) {
					queue.push(neighbor);
				}
			}
		}
	}

	logStep({});
	return steps;
};

export default dijkstra;