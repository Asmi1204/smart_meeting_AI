import { useState } from 'react';
import axios from 'axios';
import { CloudUpload, CheckCircle2, FileAudio, Sparkles, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Chatbot from './Chatbot';

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setTranscript("");
    setSummary("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an audio file first.");
      return;
    }
    setLoading(true);
    setMessage("Transcribing & summarizing... please wait.");

    const formData = new FormData();
    formData.append('audio', file);

    try {
      const res = await axios.post('http://localhost:5000/upload_audio', formData);
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
      <motion.div
        className="bg-gray-800 bg-opacity-30 p-10 rounded-xl shadow-2xl flex flex-col items-center max-w-3xl w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <CloudUpload size={50} className="text-indigo-300 mb-4"/>
        <h2 className="text-4xl font-bold mb-6">Upload Your Meeting Audio</h2>

        <label className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105">
          <FileAudio size={20}/>
          Choose File
          <input type="file" accept="audio/*" onChange={handleFileChange} hidden />
        </label>

        {file && <p className="mt-4 text-indigo-200">{file.name}</p>}

        <button
          className="mt-6 flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105 disabled:opacity-60 disabled:pointer-events-none"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : <><CheckCircle2 size={20}/> Upload & Summarize</>}
        </button>

        {message && <p className="mt-4 italic text-indigo-200">{message}</p>}

        {transcript && (
          <div className="mt-6 bg-gray-900 bg-opacity-50 p-4 rounded-lg max-h-48 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-indigo-300">Transcription:</h3>
            <p className="text-sm text-gray-200 whitespace-pre-line">{transcript}</p>
          </div>
        )}

        {summary && (
          <div className="mt-6 bg-indigo-900 bg-opacity-50 p-4 rounded-lg max-h-48 overflow-auto">
            <h3 className="text-xl font-semibold mb-2 text-purple-300">Meeting Summary:</h3>
            <p className="text-sm text-gray-200 whitespace-pre-line">{summary}</p>
          </div>
        )}

        {summary && <Chatbot transcript={transcript}/>}
      </motion.div>

      <motion.div 
        className="absolute bottom-8 animate-bounce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <Sparkles size={32} className="text-indigo-300"/>
      </motion.div>
    </div>
  );
}
