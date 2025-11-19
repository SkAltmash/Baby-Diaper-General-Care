import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import CartSkeleton from "../components/CartSkeleton";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, loading } = useContext(CartContext);

  // If cart is loading → return skeleton
  if (loading) return <CartSkeleton />;

  // TOTAL
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
            className="h-32 mx-auto mb-4 opacity-70"
          />
          <h2 className="text-xl font-semibold text-gray-600">
            Your cart is empty
          </h2>
          <Link
            to="/all"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Shop Products
          </Link>
        </motion.div>
      )}

      {/* CART WITH ITEMS */}
      {cart.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-4 bg-white p-4 shadow-md rounded-xl items-center"
              >
                {/* IMAGE */}
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                {/* INFO */}
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-sm text-gray-500">
                    {item.variant?.size && <>Size: {item.variant.size} </>}
                    {item.variant?.flavour && <> | Flavour: {item.variant.flavour}</>}
                    {item.variant?.packOf && <> | Pack of: {item.variant.packOf}</>}
                  </p>
                  <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                </div>

                {/* QTY */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="p-2 bg-gray-200 rounded-full"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="p-2 bg-gray-200 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* DELETE */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ORDER SUMMARY */}
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white p-5 shadow-lg rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between text-gray-700">
            <p>Total Amount</p>
            <p className="font-bold text-green-600">₹{total}</p>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              to="/all"
              className="flex-1 text-center bg-gray-200 text-gray-800 py-2 rounded-lg"
            >
              Continue Shopping
            </Link>

             <Link
              to="/cheekout"
              className="flex-1 text-center bg-purple-700 text-white py-2 rounded-lg"
            >
            Proceed to Checkout
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
