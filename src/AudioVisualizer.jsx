import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AudioVisualizer = ({ audioData }) => {
  const mountRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const bars = [];
    const barCount = 64;
    const barWidth = 0.5;

    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(barWidth, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - barCount / 2) * (barWidth + 0.1);
      bars.push(bar);
      scene.add(bar);
    }

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        for (let i = 0; i < barCount; i++) {
          const scale = (dataArrayRef.current[i] / 128.0) * 10; // Increase the scaling factor
          bars[i].scale.y = scale;
          bars[i].material.color.setHSL(scale / 10, 4, 0.5); // Adjust color scaling
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (audioData) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const reader = new FileReader();
      reader.readAsArrayBuffer(audioData);

      reader.onloadend = () => {
        audioContext.decodeAudioData(reader.result, (buffer) => {
          const source = audioContext.createBufferSource();
          source.buffer = buffer;

          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.9;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          source.connect(analyser);
          analyser.connect(audioContext.destination);

          analyserRef.current = analyser;
          dataArrayRef.current = dataArray;

          source.start();
        });
      };
    }
  }, [audioData]);

  return <div ref={mountRef} />;
};

export default AudioVisualizer;
