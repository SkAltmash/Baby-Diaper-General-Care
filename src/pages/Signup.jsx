import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !phone)
      return toast.error("All fields are required!");

    try {
      setLoading(true);

      // Create Firebase Auth User
      const user = await createUserWithEmailAndPassword(auth, email, password);

      // Save user to Firestore
      await setDoc(doc(db, "users", user.user.uid), {
        uid: user.user.uid,
        email,
        phone,
        createdAt: Date.now(),
      });

      toast.success("Account created successfully!");

      navigate("/"); // 🔥 redirect to home
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
          Create Your Account
        </h1>

        {/* Email */}
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Mobile */}
        <label className="text-sm font-medium">Mobile Number</label>
        <input
          type="text"
          maxLength="10"
          placeholder="Enter mobile number"
          className="border p-2 rounded w-full mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Password */}
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Create password"
          className="border p-2 rounded w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Signup Button */}
        <motion.button
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
          disabled={loading}
          onClick={handleSignup}
          className={`w-full py-2 rounded-lg font-semibold text-white 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating Account...
            </div>
          ) : (
            "Sign Up"
          )}
        </motion.button>

        <p className="text-sm text-center mt-3">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-1">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
