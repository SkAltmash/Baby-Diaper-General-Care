import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // <-- Added loading
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return toast.error("All fields are required!");

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
      toast.success("Wellcome back")
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Login Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          disabled={loading}
          onClick={handleLogin}
          className={`w-full py-2 rounded-lg font-semibold text-white 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </motion.button>

        <p className="text-sm text-center mt-3">
          Don’t have an account?
          <Link to="/signup" className="text-blue-600 ml-1">
            Signup
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
