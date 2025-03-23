import { useState } from 'react'
import axios from 'axios'
import { Send, Bot } from 'lucide-react'

export default function Chatbot({ transcript }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const askQuestion = async () => {
    if (!question) return
    try {
      setAnswer("Thinking...")
      const res = await axios.post('http://localhost:5000/ask_question', { transcript, question })
      setAnswer(res.data.answer)
    } catch (error) {
      setAnswer("Oops! Something went wrong.")
    }
  }

  return (
    <div className="mt-6 bg-purple-900 bg-opacity-30 p-6 rounded-xl shadow-lg w-full max-w-2xl">
      <h3 className="text-xl font-bold text-purple-200 mb-3 flex items-center gap-2">
        <Bot size={24}/> Ask Briefy AI
      </h3>

      <div className="flex gap-2">
        <input 
          type="text" 
          className="w-full px-4 py-2 rounded-lg text-white bg-gray-700 bg-opacity-50 placeholder-gray-300 focus:outline-none"
          placeholder="Ask me anything about your meeting..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button 
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
          onClick={askQuestion}
        >
          <Send size={20}/>
        </button>
      </div>

      {answer && (
        <div className="mt-4 bg-purple-800 bg-opacity-50 p-4 rounded-lg text-purple-100">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}
