import { useEffect } from "react";
import {
	PiGraphDuotone,
	PiListPlusDuotone,
	PiMinusCircleDuotone,
	PiNavigationArrowDuotone,
	PiPencilCircleDuotone,
	PiPlusCircleDuotone,
} from "react-icons/pi";

import { NetworkContext } from "../contexts/network-context";
import { useContextHook } from "../hooks/use-context-hook";
import { getNextNodeId, getNextNodeLabel } from "../utils/helpers";

import styles from "../styles/components/header.module.scss";

export default function Header({ isLoaderVisible }) {
	const { state, setAction, toggleGraphDirected } = useContextHook(NetworkContext);

	const interactionOptions = {
		NAVIGATING: { dragNodes: true, dragView: true, selectable: true, zoomView: true },
		ADDING_NODE: { dragNodes: false, dragView: false, selectable: false, zoomView: false },
		ADDING_EDGE: { dragNodes: false, dragView: false, selectable: false, zoomView: false },
		EDITING_EDGE: { dragNodes: false, dragView: false, selectable: true, zoomView: false },
		DELETING: { dragNodes: false, dragView: false, selectable: true, zoomView: false },
	};

	const addNode = ({ pointer }) => {
		if (state.action !== "ADDING_NODE") {
			return;
		}

		const nodes = state.network.body.data.nodes.get();
		const ids = nodes.map((node) => parseInt(node.id, 10));
		const labels = nodes.map((node) => node.label);

		const id = getNextNodeId(ids).toString();
		const label = getNextNodeLabel(labels);

		if (!label) {
			return;
		}

		state.network.body.data.nodes.add({ id, label, x: pointer.canvas.x, y: pointer.canvas.y });
	};

	const addEdge = () => {
		if (state.action !== "ADDING_EDGE") {
			return;
		}

		state.network.addEdgeMode();
	};

	const editEdge = ({ edges }) => {
		if (state.action !== "EDITING_EDGE") {
			return;
		}

		const edgeId = edges[0];
		const edge = state.network.body.data.edges.get(edgeId);
		const newLabel = window.prompt("Enter a new cost for the edge (-99 to 99):", edge.label);
		const cost = parseInt(newLabel, 10);

		if (isNaN(cost) || cost <= -100 || cost >= 100) {
			state.network.body.data.edges.remove(edgeId);
			state.network.body.data.edges.add({ id: edgeId, from: edge.from, to: edge.to });
			return;
		}

		state.network.body.data.edges.update({ id: edgeId, label: cost.toString() });
	};

	const deleteNode = ({ nodes }) => {
		if (state.action !== "DELETING" || !nodes.length) {
			return;
		}

		const hasConnections = state.network.getConnectedEdges(nodes[0]).length > 0;
		if (!hasConnections) {
			state.network.deleteSelected();
		}
	};

	const deleteEdge = () => {
		if (state.action !== "DELETING") {
			return;
		}

		state.network.deleteSelected();
	};

	useEffect(() => {
		if (!state.network || state.page !== 1) {
			return;
		}

		state.network.unselectAll();

		const handlers = {
			ADDING_NODE: () => {
				state.network.on("click", addNode);
			},
			ADDING_EDGE: () => {
				state.network.addEdgeMode();
				state.network.on("controlNodeDragEnd", addEdge);
			},
			EDITING_EDGE: () => {
				state.network.on("selectEdge", editEdge);
			},
			DELETING: () => {
				state.network.on("selectNode", deleteNode);
				state.network.on("selectEdge", deleteEdge);
			},
		};

		handlers[state.action]?.();
		state.network.fit();
		state.network.setOptions({ interaction: interactionOptions[state.action] });

		return () => {
			state.network.disableEditMode();
			state.network.off("click", addNode);
			state.network.off("controlNodeDragEnd", addEdge);
			state.network.off("selectEdge", editEdge);
			state.network.off("selectNode", deleteNode);
			state.network.off("selectEdge", deleteEdge);
		};
	}, [state.action, state.network, state.page]);

	return (
		<header
			className={`${styles.header} ${isLoaderVisible || state.page !== 1 ? styles.hidden : ""}`}
		>
			<div className={styles.content}>
				<button
					className={state.action === "NAVIGATING" ? styles.active : ""}
					onClick={() => setAction("NAVIGATING")}
				>
					<PiNavigationArrowDuotone />
				</button>

				<button
					className={state.action === "ADDING_NODE" ? styles.active : ""}
					onClick={() => setAction("ADDING_NODE")}
				>
					<PiPlusCircleDuotone />
				</button>

				<button
					className={state.action === "ADDING_EDGE" ? styles.active : ""}
					onClick={() => setAction("ADDING_EDGE")}
				>
					<PiListPlusDuotone />
				</button>

				<button
					className={state.action === "EDITING_EDGE" ? styles.active : ""}
					onClick={() => setAction("EDITING_EDGE")}
				>
					<PiPencilCircleDuotone />
				</button>

				<button
					className={state.action === "DELETING" ? styles.active : ""}
					onClick={() => setAction("DELETING")}
				>
					<PiMinusCircleDuotone />
				</button>

				<button onClick={toggleGraphDirected}>
					<PiGraphDuotone />
				</button>
			</div>
		</header>
	);
}
