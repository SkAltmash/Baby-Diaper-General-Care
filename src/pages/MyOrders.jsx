import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, Calendar, IndianRupee } from "lucide-react";

// Status colors
const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-200 text-yellow-700";
    case "Packed":
      return "bg-orange-200 text-orange-700";
    case "Out for Delivery":
      return "bg-blue-200 text-blue-700";
    case "Delivered":
      return "bg-green-200 text-green-700";
    case "Cancelled":
      return "bg-red-200 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

// Status filters
const STATUS_FILTERS = [
  "All",
  "Pending",
  "Packed",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch live orders
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ordersRef = collection(db, "users", user.uid, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push(doc.data()));

      // latest first
      list.sort((a, b) => b.createdAt - a.createdAt);

      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="animate-pulse bg-white shadow p-4 rounded-xl mb-4">
              <div className="h-5 w-40 bg-gray-300 rounded"></div>
              <div className="h-3 w-28 bg-gray-200 mt-2 rounded"></div>
              <div className="h-16 bg-gray-200 mt-4 rounded"></div>
            </div>
          ))}
      </div>
    );
  }

  // Filter orders
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => (o.status || "Pending") === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 flex-wrap mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
              filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* NO ORDERS */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-20">
          <Package size={60} className="mx-auto text-gray-400" />
          <h2 className="text-xl text-gray-600 mt-4">No orders found</h2>
          <Link to="/all" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
            Shop Products
          </Link>
        </div>
      )}

      {/* ORDERS LIST */}
      <div className="space-y-5">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.orderId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
          >
            {/* Clickable header → order details page */}
            <Link to={`/my-orders/${order.orderId}`} className="block">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <p className="font-semibold text-gray-800">
                  Order ID: <span className="text-blue-600">{order.orderId}</span>
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                    order.status || "Pending"
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Date */}
              <p className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                <Calendar size={16} />
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Items Preview */}
              <div className="mt-4 border-t pt-3 text-sm text-gray-700">
                {order.items.slice(0, 2).map((item) => (
                  <p key={item.id}>
                    {item.name} × {item.qty}
                  </p>
                ))}

                {order.items.length > 2 && (
                  <p className="text-blue-500 text-sm mt-1">
                    + {order.items.length - 2} more items...
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="flex justify-between border-t pt-3 mt-3 font-bold text-gray-800">
                <span className="flex items-center gap-1">
                  <IndianRupee size={18} /> Total
                </span>
                <span>₹{order.amount}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
