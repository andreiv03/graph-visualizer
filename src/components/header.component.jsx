import { useEffect } from "react";
import {
	PiGraphDuotone,
	PiMinusCircleDuotone,
	PiNavigationArrowDuotone,
	PiPencilCircleDuotone,
	PiPlusCircleDuotone
} from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useSystemContext } from "../contexts/system.context";
import styles from "../styles/components/header.module.scss";

const Header = () => {
	const systemContext = useSystemContext();

	useEffect(() => {
		if (!systemContext.network || systemContext.step !== 1) return;
		systemContext.network.unselectAll();

		switch (systemContext.action) {
			case "NAVIGATING":
				systemContext.network.fit();
				systemContext.network.setOptions({
					interaction: { dragNodes: true, dragView: true, selectable: true, zoomView: true }
				});
				break;

			case "ADDING_NODE":
				systemContext.network.on("click", handleAddNode);
				systemContext.network.setOptions({
					interaction: { dragNodes: false, dragView: false, selectable: false, zoomView: false }
				});
				break;

			case "ADDING_EDGE":
				systemContext.network.addEdgeMode();
				systemContext.network.on("controlNodeDragEnd", handleAddEdge);
				systemContext.network.setOptions({
					interaction: { dragNodes: false, dragView: false, selectable: false, zoomView: false }
				});
				break;

			case "EDITING_NODE":
				systemContext.network.on("selectNode", handleEditNode);
				systemContext.network.setOptions({
					interaction: { dragNodes: false, dragView: false, selectable: true, zoomView: false }
				});
				break;

			case "EDITING_EDGE":
				systemContext.network.on("selectEdge", handleEditEdge);
				systemContext.network.setOptions({
					interaction: { dragNodes: false, dragView: false, selectable: true, zoomView: false }
				});
				break;

			case "DELETING":
				systemContext.network.on("selectNode", handleDeleteNode);
				systemContext.network.on("selectEdge", handleDeleteEdge);
				systemContext.network.setOptions({
					interaction: { dragNodes: false, dragView: false, selectable: true, zoomView: false }
				});
				break;

			default:
				break;
		}

		return () => {
			systemContext.network.disableEditMode();
			systemContext.network.off("click", handleAddNode);
			systemContext.network.off("controlNodeDragEnd", handleAddEdge);
			systemContext.network.off("selectNode", handleEditNode);
			systemContext.network.off("selectEdge", handleEditEdge);
			systemContext.network.off("selectNode", handleDeleteNode);
			systemContext.network.off("selectEdge", handleDeleteEdge);
		};
	}, [systemContext.action]);

	const handleAddNode = (params) => {
		if (systemContext.action !== "ADDING_NODE") return;

		const nodeId = "node-" + Math.random().toString(36).substr(2, 7);
		systemContext.network.body.data.nodes.add({
			id: nodeId,
			label: nodeId,
			x: params.pointer.canvas.x,
			y: params.pointer.canvas.y
		});
	};

	const handleAddEdge = () => {
		if (systemContext.action !== "ADDING_EDGE") return;
		systemContext.network.addEdgeMode();
	};

	const handleEditNode = (params) => {
		if (systemContext.action !== "EDITING_NODE") return;

		const node = systemContext.network.body.data.nodes.get(params.nodes[0]);
		const label = window.prompt("Enter a new label for the node:", node.label);
		systemContext.network.body.data.nodes.update({
			id: params.nodes[0],
			label: label ? label : node.label
		});
	};

	const handleEditEdge = (params) => {
		if (systemContext.action !== "EDITING_EDGE") return;

		const edge = systemContext.network.body.data.edges.get(params.edges[0]);
		const label = window.prompt("Enter a new cost for the edge:", edge.label);
		if (isNaN(label)) return;

		systemContext.network.body.data.edges.update({
			id: params.edges[0],
			label: label ? label : edge.label
		});
	};

	const handleDeleteNode = (params) => {
		if (systemContext.action !== "DELETING") return;
		if (systemContext.network.getConnectedEdges(params.nodes[0]).length === 0)
			systemContext.network.deleteSelected();
	};

	const handleDeleteEdge = () => {
		if (systemContext.action !== "DELETING") return;
		systemContext.network.deleteSelected();
	};

	const handleSwitchType = () => {
		if (systemContext.step !== 1) return;

		systemContext.setIsGraphDirected(!systemContext.isGraphDirected);
		systemContext.network.setOptions({
			edges: {
				arrows: {
					to: { enabled: !systemContext.isGraphDirected, scaleFactor: 1 }
				}
			}
		});
	};

	return (
		<header className={styles.header}>
			<AnimatePresence>
				{systemContext.step === 1 ? (
					<motion.div
						className={styles.actions}
						key="actions"
						initial={{ opacity: 0, x: "calc(-50% - 300px)", y: "-50%" }}
						animate={{ opacity: 1, x: "-50%", y: "-50%" }}
						exit={{ opacity: 0, x: "calc(-50% + 300px)", y: "-50%" }}
						transition={{ duration: 0.5, stiffness: 50, type: "spring" }}
					>
						<button
							className={systemContext.action === "NAVIGATING" ? styles.active_one : ""}
							onClick={() => systemContext.setAction("NAVIGATING")}
						>
							<PiNavigationArrowDuotone />
						</button>

						<button
							className={
								systemContext.action === "ADDING_NODE"
									? styles.active_one
									: systemContext.action === "ADDING_EDGE"
									? styles.active_two
									: ""
							}
							onClick={() =>
								systemContext.action !== "ADDING_NODE"
									? systemContext.setAction("ADDING_NODE")
									: systemContext.setAction("ADDING_EDGE")
							}
						>
							<PiPlusCircleDuotone />
						</button>

						<button
							className={
								systemContext.action === "EDITING_NODE"
									? styles.active_one
									: systemContext.action === "EDITING_EDGE"
									? styles.active_two
									: ""
							}
							onClick={() =>
								systemContext.action !== "EDITING_NODE"
									? systemContext.setAction("EDITING_NODE")
									: systemContext.setAction("EDITING_EDGE")
							}
						>
							<PiPencilCircleDuotone />
						</button>

						<button
							className={systemContext.action === "DELETING" ? styles.active_one : ""}
							onClick={() => systemContext.setAction("DELETING")}
						>
							<PiMinusCircleDuotone />
						</button>

						<button onClick={handleSwitchType}>
							<PiGraphDuotone />
						</button>
					</motion.div>
				) : systemContext.step === 2 ? (
					<motion.div
						className={styles.algorithm}
						key="algorithm"
						onClick={systemContext.debouncedHandleToggleGrid}
						initial={{ opacity: 0, x: "calc(-50% - 300px)", y: "-50%" }}
						animate={{ opacity: 1, x: "-50%", y: "-50%" }}
						exit={{ opacity: 0, x: "calc(-50% + 300px)", y: "-50%" }}
						transition={{ duration: 0.5, stiffness: 50, type: "spring" }}
					>
						Choose an algorithm
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
};

export default Header;
