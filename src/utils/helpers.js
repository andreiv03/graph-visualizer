export const createStepLogger = ({ steps, path, visited }) => {
	return ({ edge = null, node = null }) => {
		steps.push({
			edge,
			node,
			path: Array.isArray(path) ? [...path] : { ...path },
			visited: new Set([...visited]),
		});
	};
};

export const getGraphConditions = (network, isDirected) => {
	if (!network) {
		return null;
	}

	const edges = network.body.data.edges.get();
	const nodes = network.body.data.nodes.get();

	return {
		"non-negative weights": () => !edges.some((edge) => edge.label < 0),
		"weighted graph": () => edges.every((edge) => edge.label !== undefined),
		"unweighted graph": () => edges.every((edge) => edge.label === undefined),
		"directed graph": () => isDirected,
		"undirected graph": () => !isDirected,
		"connected graph": () => {
			const adjacencyList = new Map(nodes.map((node) => [node.id, []]));
			const visited = new Set();

			edges.forEach(({ from, to }) => {
				adjacencyList.get(from).push(to);

				if (!isDirected) {
					adjacencyList.get(to).push(from);
				}
			});

			const dfs = (nodeId) => {
				if (!nodeId || visited.has(nodeId)) {
					return;
				}

				visited.add(nodeId);

				for (const neighbor of adjacencyList.get(nodeId)) {
					if (!visited.has(neighbor)) {
						dfs(neighbor);
					}
				}
			};

			dfs(nodes[0]?.id);
			return visited.size === nodes.length;
		},
	};
};

export const getNextNodeId = (existingIds) => {
	let id = 1;

	while (existingIds.includes(id)) {
		id++;
	}

	return id;
};

export const getNextNodeLabel = (existingLabels) => {
	const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	return ALPHABET.find((char) => !existingLabels.includes(char)) || null;
};

export const resetGraphStyles = (edges, nodes) => {
	edges.forEach((edge) => {
		edge.color = { color: "#9796a1" };
		edge.width = 3;
	});

	nodes.forEach((node) => {
		node.color = {
			background: "#9796a1",
			border: "#9796a1",
		};
	});
};

export const visualizeAlgorithmStep = (network, algorithm) => {
	if (!network || !algorithm) {
		return;
	}

	const step = algorithm.steps[algorithm.index];
	if (!step) {
		return;
	}

	const { edges, nodes } = network.body.data;

	const highlightEdges = (edgeIds, color) => {
		edgeIds.forEach((id) => {
			const edge = edges.get(id);

			if (edge) {
				edge.color = { color };
				edge.width = 5;
			}
		});
	};

	const highlightNodes = (nodeIds, color) => {
		nodeIds.forEach((id) => {
			const node = nodes.get(id);

			if (node) {
				node.color = { background: color, border: color };
			}
		});
	};

	resetGraphStyles(edges, nodes);

	if (step.path) {
		highlightEdges(Object.values(step.path), "#000000");
	}

	if (step.visited) {
		highlightNodes(step.visited, "#000000");
	}

	if (step.edge) {
		highlightEdges([step.edge], "#3936c8");
	}

	if (step.node) {
		const activeNodes = Array.isArray(step.node) ? step.node : [step.node];
		highlightNodes(activeNodes, "#3936c8");
	}

	network.setData({ edges, nodes });
};
