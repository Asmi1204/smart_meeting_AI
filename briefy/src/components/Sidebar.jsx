import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function Sidebar() {
  const [meetings, setMeetings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch user meetings when logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchMeetings(currentUser.uid);
      } else {
        setUser(null);
        setMeetings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch meeting history from Firebase Firestore
  const fetchMeetings = async (userId) => {
    try {
      const q = query(
        collection(db, "meetings"),
        where("user_id", "==", userId),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      const meetingsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMeetings(meetingsData);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Meeting History</h2>
      
      {/* New Meeting Button */}
      <button
        onClick={() => navigate("/")}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md mb-4"
      >
        + New Meeting
      </button>

      {/* Display Past Meetings */}
      {meetings.length > 0 ? (
        <ul>
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="cursor-pointer p-2 bg-gray-800 hover:bg-gray-700 rounded-md mb-2"
              onClick={() => navigate(`/meeting/${meeting.id}`, { state: meeting })}
            >
              {meeting.title || "Untitled Meeting"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">No past meetings found.</p>
      )}

      {/* Logout Button */}
      {user && (
        <button
          onClick={() => auth.signOut()}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md mt-4"
        >
          Logout
        </button>
      )}
    </div>
  );
}
