import { useState } from "react";
import Sidebar from "./Sidebar";
import Chatbot from "./Chatbot";

export default function MainContent() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar onSelectMeeting={setSelectedMeeting} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-950 text-white overflow-auto">
        {selectedMeeting ? (
          <>
            <h1 className="text-3xl font-bold">{selectedMeeting.title}</h1>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-300">Transcription:</h3>
              <p className="text-sm text-gray-200">{selectedMeeting.transcript}</p>
            </div>

            <div className="mt-4 p-4 bg-purple-800 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-300">Meeting Summary:</h3>
              <p className="text-sm text-gray-200">{selectedMeeting.summary}</p>
            </div>

            {/* Chatbot Section */}
            <Chatbot transcript={selectedMeeting.transcript} />
          </>
        ) : (
          <h2 className="text-xl text-gray-400">Select a meeting from the sidebar to view details</h2>
        )}
      </div>
    </div>
  );
}
