import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { auth, db } from "../firebase";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Allowed pincodes for WARDHA district
const WARDHA_PINCODES = [
  442001, 442102, 442103, 442104, 442105, 442106,
  442107, 442109, 442110, 442111, 442113, 442114,
  442201, 442202, 442204,
  442301, 442302, 442303, 442304,
];

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    paymentMode: "COD", // <-- Only COD allowed
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });

    // Force COD only
    if (e.target.name === "paymentMode") {
      toast.error("Only Cash on Delivery is available.");
    }
  };

  const placeOrder = async () => {
    if (!auth.currentUser) return toast.error("Login required!");

    if (!details.name || !details.phone || !details.address || !details.pincode)
      return toast.error("Please fill all fields");

    // Validate Wardha delivery area
    const pin = Number(details.pincode);
    if (!WARDHA_PINCODES.includes(pin)) {
      return toast.error("Sorry! Delivery is available only in Wardha district.");
    }

    // Enforce COD
    if (details.paymentMode !== "COD") {
      details.paymentMode = "COD";
      toast.error("Only Cash on Delivery is available!");
      return;
    }

    try {
      setLoading(true);

      const orderId = Date.now().toString();

      await setDoc(
        doc(db, "users", auth.currentUser.uid, "orders", orderId),
        {
          orderId,
          items: cart,
          amount: total,
          paymentMode: "COD",
          shipping: details,
          createdAt: Date.now(),
        }
      );

      toast.success("Order placed successfully!");

      // Clear cart everywhere
      clearCart();

      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-10 text-gray-600">
        Your cart is empty.  
        <a href="/all" className="text-blue-600 underline">Shop Now</a>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT SIDE - SHIPPING DETAILS */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

          <div className="space-y-3">
            <input
              name="name"
              placeholder="Full Name"
              className="border p-2 rounded w-full"
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Mobile Number"
              className="border p-2 rounded w-full"
              maxLength={10}
              onChange={handleChange}
            />

            <textarea
              name="address"
              placeholder="Full Address"
              className="border p-2 rounded w-full h-20"
              onChange={handleChange}
            />

            <input
              name="pincode"
              placeholder="Pincode (Wardha District Only)"
              className="border p-2 rounded w-full"
              maxLength={6}
              onChange={handleChange}
            />

            {/* Payment Mode (COD Only) */}
            <div>
              <p className="font-semibold mt-3 mb-1">Payment Method</p>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="COD"
                    checked={true}
                    readOnly
                  />
                  Cash on Delivery (Only Available)
                </label>

                <label className="flex items-center gap-2 opacity-40 cursor-not-allowed">
                  <input
                    type="radio"
                    disabled
                  />
                  Online Payment (Not Available)
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3 max-h-60 overflow-y-scroll pr-2">
  {cart.map((item) => (
    <div key={item.id} className="flex justify-between">
      <p>
        {item.name} × {item.qty}

        {/* VARIANT DETAILS */}
        {item.variant?.size && (
          <span className="text-gray-500 text-sm"> • Size: {item.variant.size}</span>
        )}
        {item.variant?.packOf && (
          <span className="text-gray-500 text-sm"> • Pack Of: {item.variant.packOf}</span>
        )}
        {item.variant?.flavour && (
          <span className="text-gray-500 text-sm"> • Flavour: {item.variant.flavour}</span>
        )}
      </p>

      <p>₹{item.price * item.qty}</p>
    </div>
  ))}
</div>


          <div className="border-t mt-4 pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <motion.button
            onClick={placeOrder}
            disabled={loading}
            whileHover={!loading && { scale: 1.05 }}
            className={`w-full py-3 mt-5 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
