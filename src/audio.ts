import * as THREE from "three";

//@ts-ignore
import backgroundMusicFile from "../public/assets/just-relax.mp3";

const loadBackgroundMusic = async (camera: THREE.PerspectiveCamera, listener: THREE.AudioListener ) => {
	const backgroundMusic = new THREE.Audio(listener);
	const audioLoader = new THREE.AudioLoader();
	return new Promise((resolve, reject) => {
	  audioLoader.load(backgroundMusicFile, function (buffer) {
		backgroundMusic.setBuffer(buffer);
		backgroundMusic.setLoop(true);
		backgroundMusic.setVolume(0.5);
		backgroundMusic.play();
		resolve(null);
	  });
	});
  };

export async function loadAudio(camera: THREE.PerspectiveCamera) {
	const listener = new THREE.AudioListener();
	camera.add(listener);
	await loadBackgroundMusic(camera,listener);
};