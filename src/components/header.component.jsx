import { useEffect } from "react";
import {
	PiGraphDuotone,
	PiMinusCircleDuotone,
	PiNavigationArrowDuotone,
	PiPencilCircleDuotone,
	PiPlusCircleDuotone
} from "react-icons/pi";

import { useSystemContext } from "../contexts/system.context";
import styles from "../styles/components/header.module.scss";

const getNextNodeId = (existingIds) => {
	let id = 1;
	while (existingIds.includes(id)) id = id + 1;
	return id;
};

const getNextNodeLabel = (existingLabels) => {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	return alphabet.split("").find((letter) => !existingLabels.includes(letter)) || null;
};

const Header = () => {
	const { action, setAction, isGraphDirected, setIsGraphDirected, isLoaderVisible, network, page } =
		useSystemContext();

	useEffect(() => {
		if (!network || page !== 1) return;
		network.unselectAll();

		const interactionOptions = {
			NAVIGATING: { dragNodes: true, dragView: true, selectable: true, zoomView: true },
			ADDING_NODE: { dragNodes: false, dragView: false, selectable: false, zoomView: false },
			ADDING_EDGE: { dragNodes: false, dragView: false, selectable: false, zoomView: false },
			EDITING_EDGE: { dragNodes: false, dragView: false, selectable: true, zoomView: false },
			DELETING: { dragNodes: false, dragView: false, selectable: true, zoomView: false }
		};

		const actionHandlers = {
			NAVIGATING: () => network.fit(),
			ADDING_NODE: () => network.on("click", addNode),
			ADDING_EDGE: () => {
				network.addEdgeMode();
				network.on("controlNodeDragEnd", addEdge);
			},
			EDITING_EDGE: () => network.on("selectEdge", editEdge),
			DELETING: () => {
				network.on("selectNode", deleteNode);
				network.on("selectEdge", deleteEdge);
			}
		};

		if (actionHandlers[action]) {
			actionHandlers[action]();
			network.setOptions({ interaction: interactionOptions[action] });
		}

		return () => {
			network.disableEditMode();
			network.off("click", addNode);
			network.off("controlNodeDragEnd", addEdge);
			network.off("selectEdge", editEdge);
			network.off("selectNode", deleteNode);
			network.off("selectEdge", deleteEdge);
		};
	}, [action, network, page]);

	const addNode = (params) => {
		if (action !== "ADDING_NODE") return;

		const existingNodes = network.body.data.nodes.get();
		const existingIds = existingNodes.map((node) => parseInt(node.id, 10));
		const existingLabels = existingNodes.map((node) => node.label);

		const id = getNextNodeId(existingIds).toString();
		const label = getNextNodeLabel(existingLabels);

		const { x, y } = params.pointer.canvas;
		network.body.data.nodes.add({ id, label, x, y });
	};

	const addEdge = () => {
		if (action !== "ADDING_EDGE") return;
		network.addEdgeMode();
	};

	const editEdge = (params) => {
		if (action !== "EDITING_EDGE") return;

		const edge = network.body.data.edges.get(params.edges[0]);
		const label = window.prompt("Enter a new cost for the edge between -99 and 99:", edge.label);

		if (isNaN(label) || label === null || label === "" || label <= -100 || label >= 100) {
			network.body.data.edges.remove(params.edges[0]);
			network.body.data.edges.add({
				id: edge.id,
				from: edge.from,
				to: edge.to
			});
			return;
		}

		network.body.data.edges.update({
			id: params.edges[0],
			label
		});
	};

	const deleteNode = (params) => {
		if (action !== "DELETING") return;
		if (network.getConnectedEdges(params.nodes[0]).length !== 0) return;
		network.deleteSelected();
	};

	const deleteEdge = () => {
		if (action !== "DELETING") return;
		network.deleteSelected();
	};

	const switchGraphType = () => {
		network.setOptions({
			edges: {
				arrows: {
					to: { enabled: !isGraphDirected, scaleFactor: 1 }
				}
			}
		});
		setIsGraphDirected(!isGraphDirected);
	};

	return (
		<header className={`${styles.header} ${isLoaderVisible || page !== 1 ? styles.hidden : ""}`}>
			<div className={styles.content}>
				<button
					className={action === "NAVIGATING" ? styles.active_one : ""}
					onClick={() => setAction("NAVIGATING")}
				>
					<PiNavigationArrowDuotone />
				</button>

				<button
					className={
						action === "ADDING_NODE"
							? styles.active_one
							: action === "ADDING_EDGE"
							? styles.active_two
							: ""
					}
					onClick={() =>
						action !== "ADDING_NODE" ? setAction("ADDING_NODE") : setAction("ADDING_EDGE")
					}
				>
					<PiPlusCircleDuotone />
				</button>

				<button
					className={action === "EDITING_EDGE" ? styles.active_one : ""}
					onClick={() => setAction("EDITING_EDGE")}
				>
					<PiPencilCircleDuotone />
				</button>

				<button
					className={action === "DELETING" ? styles.active_one : ""}
					onClick={() => setAction("DELETING")}
				>
					<PiMinusCircleDuotone />
				</button>

				<button onClick={switchGraphType}>
					<PiGraphDuotone />
				</button>
			</div>
		</header>
	);
};

export default Header;
