import { useState } from 'react'
import AudioRecorder from './AudioRecorder';
import AudioVisualizer from './AudioVisualizer';

function App() {
  const [count, setCount] = useState(0)
  const [audioData, setAudioData] = useState(null);

  const handleStop = (recordedData) => {
    setAudioData(recordedData.blob);
  };

  return (
    <div className="App">
      <h1>Audio Visualizer</h1>
      <AudioRecorder onStop={handleStop} />
      {audioData && <AudioVisualizer audioData={audioData} />}
    </div>
  )
}

export default App
