import * as THREE from "three";
import state from "./state" 

//@ts-ignore
import backgroundMusicFile from "../public/assets/just-relax.mp3";

//@ts-ignore
import finishSoundFile from "../public/assets/finish.mp3";


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

const loadFinishSound = async (camera: THREE.PerspectiveCamera, listener: THREE.AudioListener ) => {
	const finishSound = new THREE.Audio(listener);
	const audioLoader = new THREE.AudioLoader();
	return new Promise((resolve, reject) => {
	  audioLoader.load(finishSoundFile, function (buffer) {
		finishSound.setBuffer(buffer);
		finishSound.setLoop(false);
		finishSound.setVolume(1.0);
		state.finishSound = finishSound;
		resolve(null);
	  });
	});
  };


export async function loadAudio(camera: THREE.PerspectiveCamera) {
	const listener = new THREE.AudioListener();
	camera.add(listener);
	await loadBackgroundMusic(camera,listener);
	await loadFinishSound(camera,listener);
};