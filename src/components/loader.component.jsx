import { useEffect } from "react";
import { useSystemContext } from "../contexts/system.context";
import styles from "../styles/components/loader.module.scss";

const Loader = () => {
	const systemContext = useSystemContext();

	useEffect(() => {
		const timer = setTimeout(() => systemContext.setIsLoaderVisible(false), 3000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{systemContext.isLoaderVisible ? (
				<div className={styles.container}>
					<div className={styles.loader} />
				</div>
			) : null}
		</>
	);
};

export default Loader;
