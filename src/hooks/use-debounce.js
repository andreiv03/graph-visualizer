import { useEffect, useState } from "react";

const useDebounce = (callback, delay) => {
	const [isDebouncing, setIsDebouncing] = useState(false);

	useEffect(() => {
		if (!isDebouncing) return;
		const timer = setTimeout(() => setIsDebouncing(false), delay);
		return () => clearTimeout(timer);
	}, [isDebouncing, delay]);

	return (...args) => {
		if (isDebouncing) return;
		callback(...args);
		setIsDebouncing(true);
	};
};

export default useDebounce;
