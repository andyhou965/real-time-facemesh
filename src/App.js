/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as Facemesh from "@mediapipe/face_mesh";
import React, { useRef, useEffect } from "react";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
function App() {
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);
	var camera = null;
	const connect = window.drawConnectors;
	function onResults(results) {
		// Setting H, W of Canvas
		const videoWidth = webcamRef.current.video.videoWidth;
		const videoHeight = webcamRef.current.video.videoHeight;

		canvasRef.current.width = videoWidth;
		canvasRef.current.height = videoHeight;

		const canvasElement = canvasRef.current;
		const canvasCtx = canvasElement.getContext("2d");

		// Add Image
		// const image = new Image();
		// image.src =
		// 	"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Picture_icon_BLACK.svg/1200px-Picture_icon_BLACK.svg.png";

		canvasCtx.save();
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.drawImage(
			results.image,
			0,
			0,
			canvasElement.width,
			canvasElement.height
		);

		if (results.multiFaceLandmarks) {
			for (const landmarks of results.multiFaceLandmarks) {
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
					color: "#C0C0C070",
					lineWidth: 1,
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
					color: "#FF3030",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
					color: "#FF3030",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, {
					color: "#FF3030",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
					color: "#30FF30",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
					color: "#30FF30",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, {
					color: "#30FF30",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
					color: "#E0E0E0",
				});
				connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
					color: "#E0E0E0",
				});
			}
		}

		canvasCtx.restore();
	}
	// }

	// setInterval(())
	useEffect(() => {
		// Load model
		const faceMesh = new FaceMesh({
			locateFile: (file) =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
		});

		faceMesh.setOptions({
			maxNumFaces: 1,
			minDetectionConfidence: 0.5,
			minTrackingConfidence: 0.5,
			selfieMode: true,
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
				<img src={require("./sun.gif")} alt="my-gif" />
				<Webcam
					hidden
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
