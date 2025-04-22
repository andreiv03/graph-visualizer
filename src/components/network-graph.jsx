import { useEffect, useMemo, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";

import { NetworkContext } from "../contexts/network-context";
import { useContextHook } from "../hooks/use-context-hook";

import styles from "../styles/components/network-graph.module.scss";

export default function NetworkGraph() {
	const { initializeNetwork } = useContextHook(NetworkContext);
	const networkRef = useRef(null);

	const data = useMemo(
		() => ({
			nodes: new DataSet([]),
			edges: new DataSet([]),
		}),
		[],
	);

	const options = useMemo(
		() => ({
			edges: {
				color: {
					color: "#9796a1",
					highlight: "#9796a1",
				},
				font: {
					align: "top",
					color: "#000000",
					face: "Poppins",
					size: 16,
					strokeWidth: 0,
					vadjust: -3,
				},
				length: 300,
				width: 3,
			},
			nodes: {
				borderWidth: 3,
				color: {
					background: "#9796a1",
					border: "#9796a1",
					highlight: {
						background: "#9796a1",
						border: "#9796a1",
					},
				},
				font: {
					color: "#ffffff",
					face: "Poppins",
					size: 16,
					vadjust: -44,
				},
				shape: "dot",
				size: 24,
			},
			physics: {
				enabled: false,
			},
		}),
		[],
	);

	useEffect(() => {
		if (!networkRef.current) {
			return;
		}

		const network = new Network(networkRef.current, data, options);
		initializeNetwork(network);

		return () => {
			network.destroy();
		};
	}, []);

	return <div className={styles.network} ref={networkRef} />;
}
