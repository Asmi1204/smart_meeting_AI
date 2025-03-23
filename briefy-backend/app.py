from flask import Flask, request, jsonify
from flask_cors import CORS
import assemblyai as aai
import firebase_admin
from firebase_admin import credentials, firestore
import os
from transformers import pipeline

# Load the summarization model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Initialize AssemblyAI
aai.settings.api_key = "090445f5d1ea44b8b9381e03edfe5ee9"

# Initialize Firebase Admin SDK
cred = credentials.Certificate(os.path.join(os.getcwd(), "briefy-92e74-firebase-adminsdk-fbsvc-85511a002e.json"))
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ Root Route to Fix "Not Found" Error
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Briefy API!"})

# ✅ Handle File Upload & Transcription
@app.route("/upload_audio", methods=["POST"])
def upload_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files["audio"]
    temp_path = "temp_audio.wav"
    file.save(temp_path)

    transcript = transcribe_audio(temp_path)
    summary = summarize_text(transcript)

    user_id = request.form.get("user_id", "anonymous")
    meeting_title = request.form.get("title", "Untitled Meeting")

    # ✅ Save meeting details to Firebase Firestore
    save_meeting_to_firestore(user_id, meeting_title, transcript, summary)

    return jsonify({
        "message": "Transcription successful!",
        "transcript": transcript,
        "summary": summary
    })

# ✅ Transcribe Audio with AssemblyAI
def transcribe_audio(file_path):
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(file_path)
    return transcript.text

# ✅ Summarize Meeting Transcript (Placeholder - Upgrade Later)

def summarize_text(text):
    try:
        # Hugging Face models usually have a token limit, so we split long texts
        max_chunk = 1024
        chunks = [text[i:i + max_chunk] for i in range(0, len(text), max_chunk)]
        
        summary = ""
        for chunk in chunks:
            summary += summarizer(chunk, max_length=200, min_length=50, do_sample=False)[0]["summary_text"] + " "

        return summary.strip()
    
    except Exception as e:
        print("Error in summarization:", e)
        return "Summary generation failed!"

# ✅ Save Meeting Data to Firestore
def save_meeting_to_firestore(user_id, title, transcript, summary):
    db.collection("meetings").add({
        "user_id": user_id,
        "title": title,
        "transcript": transcript,
        "summary": summary,
        "created_at": firestore.SERVER_TIMESTAMP
    })

# ✅ Retrieve User's Meeting History
@app.route("/get_meetings", methods=["GET"])
def get_meetings():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID required"}), 400

    meetings = db.collection("meetings").where("user_id", "==", user_id).stream()
    meetings_list = [{"id": meeting.id, **meeting.to_dict()} for meeting in meetings]

    return jsonify(meetings_list)

if __name__ == "__main__":
    app.run(debug=True)
