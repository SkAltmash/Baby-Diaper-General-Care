// AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Search, Trash2, User, Users } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersRef = collection(db, "users");

    // live listener
    const unsub = onSnapshot(
      usersRef,
      async (snap) => {
        setLoading(true);
        const list = [];

        // iterate documents and fetch order counts
        for (const userDoc of snap.docs) {
          const userId = userDoc.id;
          // get orders size
          const ordersSnap = await getDocs(collection(db, "users", userId, "orders"));
          list.push({
            userId,
            ...userDoc.data(),
            orderCount: ordersSnap.size,
          });
        }

        // sort by joined time if you have createdAt else by userId
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setUsers(list);
        setLoading(false);
      },
      (err) => {
        console.error("users listener error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // helper: display name (use name || email prefix || userId)
  const displayName = (u) => {
    if (u?.name && u.name.trim() !== "") return u.name;
    if (u?.email) {
      const at = u.email.indexOf("@");
      return at > 0 ? u.email.slice(0, at) : u.email;
    }
    return u.userId || "User";
  };

  // Filter + search
  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      q === "" ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      displayName(u).toLowerCase().includes(q);

    const matchesFilter =
      filter === "All" ||
      (filter === "HasOrders" && u.orderCount > 0) ||
      (filter === "NoOrders" && u.orderCount === 0);

    return matchesSearch && matchesFilter;
  });

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete user");
    }
  };

  // Summary stats
  const totalUsers = users.length;
  const withOrders = users.filter((u) => u.orderCount > 0).length;
  const withoutOrders = users.filter((u) => u.orderCount === 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Users Overview</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {loading ? (
          // skeleton summary cards while loading
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white shadow rounded-xl p-5 border text-center animate-pulse h-28" />
            ))
        ) : (
          <>
            <div className="bg-white shadow rounded-xl p-5 border text-center">
              <Users className="mx-auto text-blue-600" size={32} />
              <h3 className="text-gray-600 text-sm mt-2">Total Users</h3>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>

            <div className="bg-white shadow rounded-xl p-5 border text-center">
              <Users className="mx-auto text-green-600" size={32} />
              <h3 className="text-gray-600 text-sm mt-2">Users With Orders</h3>
              <p className="text-2xl font-bold text-green-600">{withOrders}</p>
            </div>

            <div className="bg-white shadow rounded-xl p-5 border text-center">
              <Users className="mx-auto text-red-600" size={32} />
              <h3 className="text-gray-600 text-sm mt-2">Users Without Orders</h3>
              <p className="text-2xl font-bold text-red-600">{withoutOrders}</p>
            </div>
          </>
        )}
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center border rounded-lg px-3 w-full sm:w-1/2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by email or name..."
            className="ml-2 p-2 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="border p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Users</option>
          <option value="HasOrders">Users With Orders</option>
          <option value="NoOrders">Users Without Orders</option>
        </select>
      </div>

      {/* USERS LIST */}
      <div className="space-y-4">
        {loading ? (
          // skeleton list while loading
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white shadow rounded-xl p-5 border flex items-center justify-between gap-4 h-28"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-300 rounded" />
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-4 w-20 bg-gray-300 rounded ml-auto" />
                </div>
              </div>
            ))
        ) : (
          filteredUsers.map((u) => (
            <motion.div
              key={u.userId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow rounded-xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <User size={40} className="text-gray-500" />
                <div>
                  <p className="font-semibold text-lg">{displayName(u)}</p>
                  <p className="text-gray-600 text-sm">{u.email}</p>
                  <p className="text-gray-600 text-sm">Phone: {u.phone || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {u.userId}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  Orders:{" "}
                  <span className={u.orderCount > 0 ? "text-green-600" : "text-red-600"}>
                    {u.orderCount}
                  </span>
                </p>

                <button
                  onClick={() => deleteUser(u.userId)}
                  className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}

        {!loading && filteredUsers.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No users found</p>
        )}
      </div>
    </div>
  );
}
