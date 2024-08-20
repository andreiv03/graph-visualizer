import { useEffect } from "react";
import { useSystemContext } from "../contexts/system.context";
import styles from "../styles/components/loader.module.scss";

const Loader = () => {
	const { isLoaderVisible, setIsLoaderVisible } = useSystemContext();

	useEffect(() => {
		const timer = setTimeout(() => setIsLoaderVisible(false), 3000);
		return () => clearTimeout(timer);
	}, [setIsLoaderVisible]);

	if (!isLoaderVisible) return null;

	return (
		<div className={styles.container}>
			<div className={styles.loader} />
		</div>
	);
};

export default Loader;
