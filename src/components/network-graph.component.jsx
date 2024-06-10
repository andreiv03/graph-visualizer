import { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";
import { useSystemContext } from "../contexts/system.context";
import styles from "../styles/components/network-graph.module.scss";

const NetworkGraph = () => {
	const networkGraphRef = useRef(null);
	const systemContext = useSystemContext();

	useEffect(() => {
		const data = {
			edges: new DataSet([]),
			nodes: new DataSet([])
		};

		const options = {
			autoResize: true,
			edges: {
				font: {
					color: "#000000",
					face: "Poppins",
					size: 12,
					strokeWidth: 0
				},
				width: 2
			},
			nodes: {
				borderWidth: 2,
				color: {
					background: "#00b2b2",
					border: "#00a6a6",
					highlight: {
						background: "#00b2b2",
						border: "#00a6a6"
					},
					hover: {
						background: "#00b2b2",
						border: "#00a6a6"
					}
				},
				font: {
					color: "#000000",
					face: "Poppins",
					size: 16,
					strokeWidth: 0
				},
				shape: "dot",
				size: 24
			},
			physics: {
				enabled: true
			}
		};

		systemContext.setNetwork(new Network(networkGraphRef.current, data, options));
	}, []);

	return (
		<div
			className={styles.network_graph}
			ref={networkGraphRef}
		/>
	);
};

export default NetworkGraph;
