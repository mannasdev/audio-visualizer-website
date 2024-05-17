// src/components/AudioRecorder.js
import React, { useState } from 'react';
import { ReactMic } from 'react-mic';

const AudioRecorder = ({ onStop }) => {
  const [record, setRecord] = useState(false);

  const startRecording = () => setRecord(true);
  const stopRecording = () => setRecord(false);

  return (
    <div className='overflow-hidden'>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#000000"
        backgroundColor="#FF4081" 
        />
      <button onClick={startRecording} className='bg-blue-500 px-3 py-2 rounded-lg text-white' type="button">Start</button>
      <button onClick={stopRecording} type="button" className='bg-blue-500 px-3 py-2 rounded-lg text-white'>Stop</button>
    </div>
  );
};

export default AudioRecorder;
