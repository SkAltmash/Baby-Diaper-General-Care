import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "productReviews"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      let list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setReviews(list);
    });

    return () => unsub();
  }, []);

  // ⭐ Filter logic
  const filteredReviews =
    filter === "All"
      ? reviews
      : reviews.filter((r) => r.rating === Number(filter));

  // Delete review
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteDoc(doc(db, "productReviews", id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">All Product Reviews</h1>

      {/* Filter */}
      <div className="mb-6 flex gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="All">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="3">⭐⭐⭐ (3)</option>
          <option value="2">⭐⭐ (2)</option>
          <option value="1">⭐ (1)</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow rounded-xl p-5 border"
          >
            {/* Product ID */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Product ID: {rev.productId}</p>

                {/* User Info */}
                <p className="font-semibold mt-1">
                  {rev.userName || "User"}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteReview(rev.id)}
                className="p-2 bg-red-100 rounded-full hover:bg-red-200 text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Review Message */}
            <p className="text-gray-700 mt-3">{rev.review}</p>

            {/* Date */}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(rev.createdAt).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No reviews found</p>
      )}
    </div>
  );
}
