import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, Calendar, IndianRupee, Clock } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders live
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ordersRef = collection(db, "users", user.uid, "orders");

    const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push(doc.data()));

      // sort by date (latest first)
      list.sort((a, b) => b.createdAt - a.createdAt);

      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---- Loading Skeleton ----
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {Array(3).fill(0).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-white shadow p-4 rounded-xl mb-4"
          >
            <div className="h-5 w-40 bg-gray-300 rounded"></div>
            <div className="h-3 w-28 bg-gray-200 mt-2 rounded"></div>
            <div className="h-16 bg-gray-200 mt-4 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // ---- If No Orders ----
  if (!loading && orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={60} className="mx-auto text-gray-400" />
        <h2 className="text-xl text-gray-600 mt-4">No orders found</h2>
        <Link
          to="/all"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  // ---- Orders List ----
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.map((order) => (
          <motion.div
            key={order.orderId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-3">
              <p className="font-semibold text-gray-800">
                Order ID: <span className="text-blue-600">{order.orderId}</span>
              </p>

              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Clock size={16} /> Pending
              </span>
            </div>

            {/* Date */}
            <p className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <Calendar size={16} />
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* Items */}
            <div className="mt-4 border-t pt-3 space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.name} × {item.qty}
                    {item.variant?.size && (
                      <> | Size: {item.variant.size}</>
                    )}
                    {item.variant?.flavour && (
                      <> | Flavour: {item.variant.flavour}</>
                    )}
                    {item.variant?.packOf && (
                      <> | Pack of: {item.variant.packOf}</>
                    )}
                  </span>

                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* Amount */}
            <div className="flex justify-between border-t pt-3 mt-3 font-bold text-gray-800">
              <span className="flex items-center gap-1">
                <IndianRupee size={18} /> Total
              </span>
              <span>₹{order.amount}</span>
            </div>

            {/* Shipping details */}
            <div className="text-sm text-gray-600 mt-3">
              <p>
                <strong>Name:</strong> {order.shipping.name}
              </p>
              <p>
                <strong>Phone:</strong> {order.shipping.phone}
              </p>
              <p>
                <strong>Address:</strong> {order.shipping.address},{" "}
                {order.shipping.pincode}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
