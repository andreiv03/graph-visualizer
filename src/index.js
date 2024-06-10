import React from "react";
import ReactDOM from "react-dom/client";
import { SystemContextProvider } from "./contexts/system.context";

import "./styles/index.scss";
import Loader from "./components/loader.component";
import AlgorithmsGrid from "./components/algorithms-grid.component";
import Header from "./components/header.component";
import NetworkGraph from "./components/network-graph.component";
import BottomBar from "./components/bottom-bar.component";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<SystemContextProvider>
			<Loader />
			<AlgorithmsGrid />
			<Header />
			<main>
				<NetworkGraph />
			</main>
			<BottomBar />
		</SystemContextProvider>
	</React.StrictMode>
);
