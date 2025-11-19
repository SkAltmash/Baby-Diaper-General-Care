import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Menu, X ,ShoppingCart, PackageSearch, Home } from "lucide-react";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MAIN NAVBAR */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="text-xl font-bold text-blue-600">
           <img src="/logo.png" className="h-20 w-20 object-cover" alt="" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6 items-center">
            <Link className="text-gray-700 hover:text-blue-600" to="/">Home</Link>
            <Link className="text-gray-700 hover:text-blue-600" to="/all">Products</Link>

            <Link to="/cart" className="text-gray-700 hover:text-blue-600 font-medium">
              <ShoppingCart />
            </Link>

            {!user ? (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
               <p className="text-gray-700">
                 {user.email.split("@")[0]}
               </p>              
               <button
                  onClick={() => signOut(auth)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={28} />
          </button>
        </div>
      </motion.nav>

      {/* BACKDROP OVERLAY */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
        />
      )}

      {/* MOBILE SLIDING SIDEBAR */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="fixed top-0 left-0 w-72 h-full bg-white shadow-xl z-50 p-5"
      >
        {/* Close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-blue-600">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-4 text-gray-700">
          <Link
          className="flex flex-row gap-2"
           to="/" onClick={() => setOpen(false)}> Home <Home /></Link>
          <Link
          className="flex flex-row gap-2"
          to="/all" onClick={() => setOpen(false)}>Products <PackageSearch /></Link>
         <Link 
         className="flex flex-row gap-2"
         to="/cart" onClick={() => setOpen(false)}>Cart <ShoppingCart /></Link>

          {!user ? (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                signOut(auth);
                setOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </nav>
      </motion.div>
    </>
  );
}
