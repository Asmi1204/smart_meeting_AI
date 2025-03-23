import { useState, useRef } from 'react'
import axios from 'axios'
import { Mic, StopCircle, LoaderCircle } from 'lucide-react'

export default function AudioRecorder({ onTranscription }) {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Start recording function
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      setAudioBlob(audioBlob)
    }

    mediaRecorderRef.current.start()
    setRecording(true)
  }

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  // Upload recorded audio for transcription
  const uploadAudio = async () => {
    if (!audioBlob) return

    setLoading(true)
    const formData = new FormData()
    formData.append('audio', new File([audioBlob], "recorded_audio.wav", { type: "audio/wav" }))

    try {
      const res = await axios.post('http://localhost:5000/upload_audio', formData)
      onTranscription(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-6">
      {recording ? (
        <button 
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          onClick={stopRecording}
        >
          <StopCircle size={20}/> Stop Recording
        </button>
      ) : (
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          onClick={startRecording}
        >
          <Mic size={20}/> Start Recording
        </button>
      )}

      {audioBlob && (
        <button 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
          onClick={uploadAudio}
          disabled={loading}
        >
          {loading ? <LoaderCircle className="animate-spin" /> : "Upload & Transcribe"}
        </button>
      )}
    </div>
  )
}
