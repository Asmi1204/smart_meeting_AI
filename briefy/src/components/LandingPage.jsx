import { useNavigate } from "react-router-dom";
import { CloudUpload, Mic } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
      <h1 className="text-5xl font-bold">Welcome to <span className="text-purple-400">Briefy</span></h1>
      <p className="mt-2 text-lg text-gray-300">Your AI-powered meeting assistant.</p>

      {/* Buttons for Upload & Record */}
      <div className="mt-6 flex gap-4">
        <button
          className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-transform hover:scale-105"
          onClick={() => navigate("/upload")}
        >
          <CloudUpload size={20} />
          Upload Audio
        </button>

        <button
          className="flex items-center gap-2 bg-purple-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-600 transition-transform hover:scale-105"
          onClick={() => navigate("/record")}
        >
          <Mic size={20} />
          Record Audio
        </button>
      </div>
    </div>
  );
}
