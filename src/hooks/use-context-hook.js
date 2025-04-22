import { useContext } from "react";

export const useContextHook = (context) => {
	const value = useContext(context);

	if (!value) {
		throw new Error("This hook must be used within a Provider");
	}

	return value;
};
