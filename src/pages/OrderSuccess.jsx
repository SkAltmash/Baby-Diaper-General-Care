import React from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="mb-6"
      >
        <CheckCircle size={100} className="text-green-600" />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800">Order Placed Successfully!</h1>

      {/* Subtitle */}
      <p className="text-gray-600 mt-2 max-w-md">
        Thank you for shopping with us. Your order has been received and is now being processed.
      </p>

      {/* Order ID */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-100 px-5 py-3 rounded-lg mt-5 border border-gray-300"
      >
        <p className="text-gray-700 text-sm">Your Order ID</p>
        <p className="font-bold text-gray-900 text-lg">#{orderId}</p>
      </motion.div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          to="/all"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>

        <Link
          to="/my-orders"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          View My Orders
        </Link>
      </div>
    </motion.div>
  );
}
