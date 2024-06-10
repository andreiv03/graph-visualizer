import { createContext, useContext, useState } from "react";
import useDebounce from "../hooks/use-debounce";

export const SystemContext = createContext({});

export const useSystemContext = () => {
	const systemContext = useContext(SystemContext);
	if (!systemContext) throw new Error("Something went wrong with the React Context API!");
	return systemContext;
};

export const SystemContextProvider = ({ children }) => {
	const [action, setAction] = useState("NAVIGATING");
	const [algorithm, setAlgorithm] = useState("");
	const [isAlgorithmsGridVisible, setIsAlgorithmsGridVisible] = useState(false);
	const [isGraphDirected, setIsGraphDirected] = useState(false);
	const [isLoaderVisible, setIsLoaderVisible] = useState(true);
	const [network, setNetwork] = useState(null);
	const [step, setStep] = useState(1);

	const debouncedHandleToggleGrid = useDebounce(
		() => setIsAlgorithmsGridVisible(!isAlgorithmsGridVisible),
		1500
	);

	const state = {
		// States
		action,
		setAction,
		algorithm,
		setAlgorithm,
		isAlgorithmsGridVisible,
		setIsAlgorithmsGridVisible,
		isGraphDirected,
		setIsGraphDirected,
		isLoaderVisible,
		setIsLoaderVisible,
		network,
		setNetwork,
		step,
		setStep,

		// Functions
		debouncedHandleToggleGrid
	};

	return <SystemContext.Provider value={state}>{children}</SystemContext.Provider>;
};
