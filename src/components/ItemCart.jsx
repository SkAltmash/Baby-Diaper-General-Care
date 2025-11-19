import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ItemCart({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-3 cursor-pointer"
    >
      {/* Product Image */}
      <Link to={`/products/${item.id}`}>
        <div className="w-full h-50 sm:h-60 md:h-70 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {item.mainImage ? (
            <img
              src={item.mainImage}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>
      </Link>

      {/* Product Name */}
      <h2 className="text-sm font-semibold text-gray-800 mt-3">
        {item.name}
      </h2>

      {/* Subcategory */}
      <p className="text-xs text-gray-500">{item.subCategory}</p>

      {/* Price */}
      <p className="text-sm font-bold text-green-600 mt-1">
        ₹{item.variants?.[0]?.offerPrice || item.offerPrice}
      </p>

      {/* Button */}
      <Link to={`/products/${item.id}`}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="w-full mt-3 bg-purple-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          View Product
        </motion.button>
      </Link>
    </motion.div>
  );
}

export default ItemCart;
