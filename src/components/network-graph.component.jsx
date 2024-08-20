import { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";

import { useSystemContext } from "../contexts/system.context";
import styles from "../styles/components/network-graph.module.scss";

const data = {
	edges: new DataSet([]),
	nodes: new DataSet([])
};

const options = {
	edges: {
		color: {
			color: "#9796a1",
			highlight: "#9796a1"
		},
		font: {
			align: "top",
			color: "#000000",
			face: "Poppins",
			size: 16,
			strokeWidth: 0,
			vadjust: -3
		},
		length: 300,
		width: 3
	},
	nodes: {
		borderWidth: 3,
		color: {
			background: "#9796a1",
			border: "#9796a1",
			highlight: {
				background: "#9796a1",
				border: "#9796a1"
			}
		},
		font: {
			color: "#fff",
			face: "Poppins",
			size: 16,
			vadjust: -44
		},
		shape: "dot",
		size: 24
	},
	physics: {
		enabled: false
	}
};

const NetworkGraph = () => {
	const networkGraphRef = useRef(null);
	const { setNetwork } = useSystemContext();

	useEffect(() => {
		const network = new Network(networkGraphRef.current, data, options);
		setNetwork(network);
		return () => network.destroy();
	}, [setNetwork]);

	return (
		<div
			className={styles.network_graph}
			ref={networkGraphRef}
		/>
	);
};

export default NetworkGraph;
