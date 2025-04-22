import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { NetworkProvider } from "./contexts/network-context";

import AlgorithmsGrid from "./components/algorithms-grid";
import BottomBar from "./components/bottom-bar";
import Header from "./components/header";
import Loader from "./components/loader";
import NetworkGraph from "./components/network-graph";
import "./styles/globals.scss";

function App() {
	const [isAlgorithmsGridVisible, setIsAlgorithmsGridVisible] = useState(false);
	const [isLoaderVisible, setIsLoaderVisible] = useState(true);

	return (
		<NetworkProvider>
			<Loader isLoaderVisible={isLoaderVisible} setIsLoaderVisible={setIsLoaderVisible} />
			<NetworkGraph />
			<Header isLoaderVisible={isLoaderVisible} />
			<BottomBar setIsAlgorithmsGridVisible={setIsAlgorithmsGridVisible} />
			<AlgorithmsGrid
				isAlgorithmsGridVisible={isAlgorithmsGridVisible}
				setIsAlgorithmsGridVisible={setIsAlgorithmsGridVisible}
			/>
		</NetworkProvider>
	);
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
