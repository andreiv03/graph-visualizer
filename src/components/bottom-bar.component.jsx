import { useCallback } from "react";
import { PiArrowCircleLeftDuotone, PiArrowCircleRightDuotone } from "react-icons/pi";
import { useSystemContext } from "../contexts/system.context";
import useDebounce from "../hooks/use-debounce";
import styles from "../styles/components/bottom-bar.module.scss";

const BottomBar = () => {
	const systemContext = useSystemContext();

	const handleStepChange = useCallback((step) => {
		if (!systemContext.network || !systemContext.network.body.data.nodes.length) return;

		systemContext.setAction("NAVIGATING");
		systemContext.setStep(step);
		systemContext.network.fit();
		systemContext.network.setOptions({
			interaction: {
				dragNodes: step === 1 ? true : false,
				dragView: step === 1 ? true : false,
				selectable: step === 1 ? true : false,
				zoomView: step === 1 ? true : false
			}
		});
	});

	const debouncedHandleStepChange = useDebounce(handleStepChange, 1500);

	return (
		<>
			<div
				className={`${styles.bottom_bar} ${systemContext.isLoaderVisible ? styles.visible : ""}`}
			>
				<button
					disabled={systemContext.step <= 1}
					onClick={() => debouncedHandleStepChange(systemContext.step - 1)}
				>
					<PiArrowCircleLeftDuotone />
				</button>

				<div className={styles.tooltip}>
					<h4>
						{systemContext.step === 1
							? `Action: ${systemContext.action}`
							: systemContext.step === 2
							? `Algorithm: ${systemContext.algorithm !== "" ? systemContext.algorithm : "None"}`
							: "Results"}
					</h4>
				</div>

				<button
					disabled={systemContext.step >= 2}
					onClick={() => debouncedHandleStepChange(systemContext.step + 1)}
				>
					<PiArrowCircleRightDuotone />
				</button>
			</div>

			<div className={styles.overlay} />
		</>
	);
};

export default BottomBar;
