import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collectionGroup,
  query,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collectionGroup(db, "orders"));
        const snap = await getDocs(q);

        let list = [];
        snap.forEach((d) =>
          list.push({
            orderId: d.data().orderId,
            ...d.data(),
            userId: d.ref.parent.parent.id,
          })
        );

        setOrders(list);
      } catch (err) {
        console.error("Fetch Orders Error:", err);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Update status
  const updateStatus = async (userId, orderId, status) => {
    try {
      await updateDoc(doc(db, "users", userId, "orders", orderId), { status });
      toast.success("Order status updated!");

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Stats
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => (o.status || "Pending") === filter);

  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => (o.status || "Pending") === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  // Badge color function
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

  if (loading)
    return (
     <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-center">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <p className="text-xl font-bold">{totalOrders}</p>
          <p>Total Orders</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded-lg">
          <p className="text-xl font-bold">{pendingCount}</p>
          <p>Pending</p>
        </div>

        <div className="bg-green-600 text-white p-4 rounded-lg">
          <p className="text-xl font-bold">{deliveredCount}</p>
          <p>Delivered</p>
        </div>

        <div className="bg-red-600 text-white p-4 rounded-lg">
  <p className="text-xl font-bold">
    {orders.filter((o) => o.status === "Cancelled").length}
  </p>
  <p>Cancelled</p>
</div>

      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {["All", "Pending", "Packed", "Out for Delivery", "Delivered" ,"Cancelled"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.orderId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-xl shadow"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Order #{order.orderId}
              </h2>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(
                  order.status || "Pending"
                )}`}
              >
                {order.status || "Pending"}
              </span>
            </div>

            {/* User */}
            <p className="font-semibold">{order.shipping.name}</p>
            <p>{order.shipping.phone}</p>
            <p>{order.shipping.address}</p>
            <p>Pincode: {order.shipping.pincode}</p>

            <p className="mt-2 font-bold text-green-600">
              Total: ₹{order.amount}
            </p>

            {/* Update Status */}
            <div className="mt-3">
              <label className="font-semibold">Update Status: </label>
              <select
                className="border p-2 rounded ml-2"
                defaultValue={order.status || "Pending"}
                onChange={(e) =>
                  updateStatus(order.userId, order.orderId, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Packed">Packed</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>

              </select>
            </div>

            {/* Items */}
            <h3 className="mt-4 font-semibold">Items:</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between border-b py-1">
                <span>
                  <img src={item.mainImage} alt=""  className="h-10 w-10"/>
                  {item.name} ({item.variant.size || ""}
                  {item.variant.flavour ? ` | ${item.variant.flavour}` : ""}
                  {item.variant.packOf ? ` | Pack of ${item.variant.packOf}` : ""}
                  ) × {item.qty}
                </span>

                <span>₹{item.qty * item.price}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
