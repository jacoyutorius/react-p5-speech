import { useEffect, useRef } from "react";
import MySketch, { setTranscript, setVolume } from "./MySketch";

function App() {
  const recognitionRef = useRef(null);

  useEffect(() => {
    // SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "ja-JP";
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(transcript);
    };
    recognition.start();
    recognitionRef.current = recognition;

    // Audio volume
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.fftSize);
      source.connect(analyser);

      const updateVolume = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0 - 1.0;
          sum += v * v;
        }
        const volume = Math.sqrt(sum / dataArray.length);
        setVolume(volume * 10);
        requestAnimationFrame(updateVolume);
      };
      updateVolume();
    });

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <div>
      <h1>🎙️ react-p5 で音声可視化</h1>
      <MySketch />
    </div>
  );
}

export default App;
