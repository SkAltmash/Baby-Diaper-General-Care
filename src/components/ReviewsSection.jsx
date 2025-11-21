import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "productReviews"),
      where("productId", "==", productId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      setReviews(list);
    });

    return () => unsub();
  }, [productId]);

  if (reviews.length === 0)
    return <p className="text-gray-500 mt-5">No reviews yet.</p>;

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-3">Customer Reviews</h3>

      {reviews.map((r, i) => (
        <div key={i} className="border-b pb-3 mb-3">
          <p className="font-semibold">{r.userName}</p>
          <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
          <p className="text-gray-700 text-sm">{r.review}</p>
        </div>
      ))}
    </div>
  );
}
