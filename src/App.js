import * as face_mesh from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
function App() {
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);
	var camera = null;
	function onResults(results) {
		// console.log(results);
	}
	// }

	// setInterval(())
	useEffect(() => {
		// Load model
		const faceMesh = new face_mesh.FaceMesh({
			locateFile: (file) =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
		});

		faceMesh.setOptions({
			maxNumFaces: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
		});

		faceMesh.onResults(onResults);

		if (
			typeof webcamRef.current !== "undefined" &&
			webcamRef.current !== null
		) {
			camera = new cam.Camera(webcamRef.current.video, {
				onFrame: async () => {
					await faceMesh.send({ image: webcamRef.current.video });
				},
				width: 640,
				height: 480,
			});
			camera.start();
		}
	}, []);
	return (
		<center>
			<div className="App">
				<Webcam
					ref={webcamRef}
					style={{
						position: "absolute",
						marginLeft: "auto",
						marginRight: "auto",
						left: 0,
						right: 0,
						textAlign: "center",
						zindex: 9,
						width: 640,
						height: 480,
					}}
				/>{" "}
				<canvas
					ref={canvasRef}
					className="output_canvas"
					style={{
						position: "absolute",
						marginLeft: "auto",
						marginRight: "auto",
						left: 0,
						right: 0,
						textAlign: "center",
						zindex: 9,
						width: 640,
						height: 480,
					}}
				></canvas>
			</div>
		</center>
	);
}

export default App;
