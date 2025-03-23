import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signInWithGoogle, signUpWithEmail, signInWithEmail, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white">
      <motion.div
        className="bg-gray-800 bg-opacity-50 p-10 rounded-lg shadow-lg max-w-md w-full text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6">
          {isSignUp ? "Create an Account" : "Welcome to Briefy"}
        </h2>

        {/* Toggle between login & signup */}
        <p className="text-gray-300 mb-4">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign up"}
          </span>
        </p>

        {/* Email/Password Login */}
        <form onSubmit={handleEmailAuth} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md bg-gray-900 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-md bg-gray-900 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-md text-lg font-semibold transition-all"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Show error messages */}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* OR Divider */}
        <div className="mt-4 flex items-center justify-center">
          <div className="border-t border-gray-600 w-24"></div>
          <p className="mx-2 text-gray-400">OR</p>
          <div className="border-t border-gray-600 w-24"></div>
        </div>

        {/* Google Sign-in Button */}
        <button
          onClick={signInWithGoogle}
          className="mt-4 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-md text-lg font-semibold transition-all w-full"
        >
          Sign in with Google
        </button>

        {/* Terms & Privacy */}
        <p className="text-gray-400 mt-4 text-sm">
          By continuing, you agree to our{" "}
          <span className="text-indigo-400 cursor-pointer hover:underline">
            Terms of Service
          </span>{" "}
          &{" "}
          <span className="text-indigo-400 cursor-pointer hover:underline">
            Privacy Policy
          </span>
        </p>
      </motion.div>
    </div>
  );
}
