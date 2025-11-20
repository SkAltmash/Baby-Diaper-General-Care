import React from "react";
import { Link } from "react-router-dom";
import { Package, ClipboardList, PlusCircle, Users, Settings, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const menu = [
    {
      name: "All Orders",
      icon: <ClipboardList size={30} />,
      link: "/admin/orders",
      color: "bg-blue-500",
    },
    {
      name: "All Products",
      icon: <Package size={30} />,
      link: "/admin/products",
      color: "bg-green-500",
    },
    {
      name: "Add Product",
      icon: <PlusCircle size={30} />,
      link: "/admin/products/add",
      color: "bg-purple-500",
    },
    {
      name: "Users",
      icon: <Users size={30} />,
      link: "/admin/users",
      color: "bg-orange-500",
    },
    {
      name: "Settings",
      icon: <Settings size={30} />,
      link: "/admin/settings",
      color: "bg-gray-600",
    },
    {
      name: "Logout",
      icon: <LogOut size={30} />,
      link: "/admin/logout",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">

        {menu.map((item) => (
          <Link
            to={item.link}
            key={item.name}
            className="bg-white shadow-md p-6 rounded-xl flex flex-col items-center hover:shadow-xl transition"
          >
            <div
              className={`${item.color} text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4`}
            >
              {item.icon}
            </div>

            <p className="text-center text-gray-800 font-semibold">
              {item.name}
            </p>
          </Link>
        ))}

      </div>
    </div>
  );
}
