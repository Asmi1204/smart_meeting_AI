import { useState, useRef } from "react";
import { Mic, CheckCircle2, Play, StopCircle, CloudUpload } from "lucide-react";
import axios from "axios";
import Chatbot from "./Chatbot"; // ✅ Import Chatbot component

export default function RecordAudio() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(""); // ✅ Stores transcript
  const [summary, setSummary] = useState(""); // ✅ Stores summary
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // 🎙️ Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessage("Microphone access denied!");
    }
  };

  // 🛑 Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // 🚀 Upload & Transcribe
  const handleUpload = async () => {
    if (!audioBlob) {
      setMessage("No audio recorded!");
      return;
    }

    setLoading(true);
    setMessage("Transcribing & summarizing... please wait.");

    const formData = new FormData();
    formData.append("audio", audioBlob, "recorded_audio.wav");

    try {
      const res = await axios.post("http://localhost:5000/upload_audio", formData);
      
      // ✅ Store the transcript and summary to show them on this page
      setMessage(res.data.message);
      setTranscript(res.data.transcript);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading/transcribing file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center px-4 text-white">
      <div className="bg-gray-800 bg-opacity-30 p-10 rounded-xl shadow-2xl flex flex-col items-center max-w-3xl w-full">
        <h2 className="text-4xl font-bold mb-6">Record Your Meeting Audio</h2>

        {/* 🎤 Record & Stop Buttons */}
        {!recording ? (
          <button
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-transform hover:scale-105"
            onClick={startRecording}
          >
            <Mic size={20} /> Start Recording
          </button>
        ) : (
          <button
            className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-gray-600 transition-transform hover:scale-105"
            onClick={stopRecording}
          >
            <StopCircle size={20} /> Stop Recording
          </button>
        )}

        {/* 🎵 Audio Playback */}
        {audioURL && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm text-gray-300">Recorded Audio:</p>
            <audio controls className="mt-2">
              <source src={audioURL} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* 📤 Upload Button */}
        <button
          className="mt-6 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105 disabled:opacity-60 disabled:pointer-events-none"
          onClick={handleUpload}
          disabled={loading || !audioBlob}
        >
          {loading ? (
            <div className="flex items-center">
              <CheckCircle2 className="animate-spin" /> Processing...
            </div>
          ) : (
            <>
              <CloudUpload size={20} /> Upload & Summarize
            </>
          )}
        </button>

        {/* 🔄 Status Message */}
        {message && <p className="mt-4 italic text-indigo-200">{message}</p>}

        {/* 📜 Transcription Display */}
        {transcript && (
          <div className="mt-6 bg-gray-900 bg-opacity-50 p-4 rounded-lg max-h-48 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-indigo-300">Transcription:</h3>
            <p className="text-sm text-gray-200 whitespace-pre-line">{transcript}</p>
          </div>
        )}

        {/* 📑 Summary Display */}
        {summary && (
          <div className="mt-6 bg-indigo-900 bg-opacity-50 p-4 rounded-lg max-h-48 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-purple-300">Meeting Summary:</h3>
            <p className="text-sm text-gray-200 whitespace-pre-line">{summary}</p>
          </div>
        )}

        {/* 🤖 AI Chatbot */}
        {summary && <Chatbot transcript={transcript} />}
      </div>
    </div>
  );
}
