import { useEffect, useRef } from "react";
import styles from "../styles/components/loader.module.scss";

export default function Loader({ isLoaderVisible, setIsLoaderVisible }) {
	const timerRef = useRef(null);

	useEffect(() => {
		if (isLoaderVisible === false) {
			return;
		}

		timerRef.current = setTimeout(() => {
			setIsLoaderVisible(false);
		}, 3000);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [setIsLoaderVisible]);

	if (isLoaderVisible === false) {
		return null;
	}

	return (
		<div className={styles.container}>
			<div className={styles.loader} />
		</div>
	);
}
