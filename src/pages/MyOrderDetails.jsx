import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc, addDoc, collection } from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Calendar, IndianRupee, Package, XCircle } from "lucide-react";

// Status badge colors
const statusColor = (status) => {
  switch (status) {
    case "Pending": return "bg-yellow-200 text-yellow-700";
    case "Packed": return "bg-orange-200 text-orange-700";
    case "Out for Delivery": return "bg-blue-200 text-blue-700";
    case "Delivered": return "bg-green-200 text-green-700";
    case "Cancelled": return "bg-red-200 text-red-700";
    default: return "bg-gray-200 text-gray-700";
  }
};

export default function MyOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  // Review modal states
  const [showReview, setShowReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewTxt, setReviewTxt] = useState("");

  const openReviewModal = (item) => {
    setSelectedProduct(item);
    setShowReview(true);
  };

  const submitReview = async () => {
    if (!reviewTxt.trim()) return toast.error("Please write something!");

    try {
      await addDoc(collection(db, "productReviews"), {
        productId: selectedProduct.productId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email,
        rating,
        review: reviewTxt,
        createdAt: Date.now(),
      });

      toast.success("Review submitted!");
      setShowReview(false);
      setReviewTxt("");

    } catch (e) {
      console.log(e);
      toast.error("Failed to submit review");
    }
  };

  // Fetch order live
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const orderRef = doc(db, "users", user.uid, "orders", orderId);

    const unsub = onSnapshot(orderRef, (snap) => {
      if (snap.exists()) {
        setOrder(snap.data());
      } else {
        setOrder(null);
      }
    });

    return () => unsub();
  }, [orderId]);

  if (order === null) {
    return (
      <div className="text-center py-20">
        <Package size={60} className="mx-auto text-gray-400" />
        <h2 className="text-xl text-gray-600 mt-4">Order not found</h2>
        <Link to="/my-orders" className="text-blue-600 underline mt-2 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const cancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const user = auth.currentUser;
      const orderRef = doc(db, "users", user.uid, "orders", orderId);

      await updateDoc(orderRef, { status: "Cancelled" });

      toast.success("Order cancelled");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Link to="/my-orders" className="text-blue-600 underline text-sm">
        ← Back to My Orders
      </Link>

      <h1 className="text-3xl font-bold mt-3 mb-6">Order Details</h1>

      {/* Status + Date */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <span className={`px-4 py-1.5 rounded-full font-semibold ${statusColor(order.status || "Pending")}`}>
          {order.status || "Pending"}
        </span>

        <p className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar size={18} /> {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Items</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b pb-3">
              <img src={item.mainImage} className="w-16 h-16 rounded-lg object-cover" />

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>

                <p className="text-sm text-gray-600">
                  Qty: {item.qty}
                  {item.variant?.size && <> | Size: {item.variant.size}</>}
                  {item.variant?.flavour && <> | Flavour: {item.variant.flavour}</>}
                  {item.variant?.packOf && <> | Pack: {item.variant.packOf}</>}
                </p>

                <p className="text-green-600 font-bold mt-1">₹{item.price * item.qty}</p>

                {/* Write Review button only if Delivered */}
                {order.status === "Delivered" && (
                  <button
                    onClick={() => openReviewModal(item)}
                    className="text-blue-600 underline text-sm mt-1"
                  >
                    Write Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Shipping Details</h2>

        <p><strong>Name:</strong> {order.shipping.name}</p>
        <p><strong>Phone:</strong> {order.shipping.phone}</p>
        <p><strong>Address:</strong> {order.shipping.address}</p>
        <p><strong>Pincode:</strong> {order.shipping.pincode}</p>
      </div>

      {/* Payment */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Payment Summary</h2>

        <div className="flex justify-between text-lg font-semibold mb-3">
          <span className="flex items-center gap-2">
            <IndianRupee size={18} /> Total Amount
          </span>
          <span>₹{order.amount}</span>
        </div>

        {(order.status === "Pending" || order.status === "Packed") && (
          <button
            onClick={cancelOrder}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <XCircle size={20} /> Cancel Order
          </button>
        )}
      </div>

      {/* Review Modal */}
      {showReview && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center px-4"
          onClick={() => setShowReview(false)}
        >
          <div
            className="bg-white p-5 rounded-xl w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-3">
              Review: {selectedProduct.name}
            </h2>

            {/* Rating */}
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-2 rounded w-full"
            >
              <option value="5">⭐ ⭐ ⭐ ⭐ ⭐ (5)</option>
              <option value="4">⭐ ⭐ ⭐ ⭐ (4)</option>
              <option value="3">⭐ ⭐ ⭐ (3)</option>
              <option value="2">⭐ ⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>

            {/* Review */}
            <textarea
              value={reviewTxt}
              onChange={(e) => setReviewTxt(e.target.value)}
              className="border p-2 rounded w-full h-28 mt-3"
              placeholder="Write your review..."
            />

            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowReview(false)}>
                Cancel
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={submitReview}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
