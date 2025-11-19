import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-56 sm:h-72 md:h-80 bg-gradient-to-r from-purple-600 to-indigo-600 
                 rounded-2xl flex items-center justify-center text-white shadow-xl mt-4 px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center"
      >
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide"
        >
          Baby Diaper & General Care
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-2 text-sm sm:text-base md:text-lg opacity-95"
        >
          Trusted products for your family's comfort & care ✨
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/all"
              className="inline-block mt-5 bg-white text-blue-600 font-semibold px-6 py-2
                         rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
