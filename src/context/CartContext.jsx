import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  getDocs,     // <-- MISSING IMPORT ADDED
} from "firebase/firestore";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // LISTEN TO FIRESTORE WHEN LOGGED IN
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setCart([]);
        setLoading(false);
        return;
      }

      const cartRef = collection(db, "users", user.uid, "cart");

      const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => items.push(doc.data()));

        setCart(items);
        setLoading(false);
      });

      return unsubscribeCart;
    });

    return () => unsubscribeAuth();
  }, []);

  // SAVE DOCUMENT TO FIRESTORE
  const saveToFirestore = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "users", user.uid, "cart", item.id), item);
  };

  // ADD ITEM
  const addToCart = (product, variant) => {
    const user = auth.currentUser;
    if (!user) return false;

    const id = `${product.id}-${variant.size || variant.flavour || "default"}`;
    const img = product.mainImage || product.images?.[0] || "/no-image.png";

    setCart((prev) => {
      const exists = prev.find((i) => i.id === id);

      let updatedCart;

      if (exists) {
        updatedCart = prev.map((i) =>
          i.id === id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updatedCart = [
          ...prev,
          {
            id,
            productId: product.id,
            name: product.name,
            price: variant.offerPrice,
            variant,
            qty: 1,
            mainImage: img,
          },
        ];
      }

      saveToFirestore(updatedCart.find((i) => i.id === id));
      return updatedCart;
    });

    return true;
  };

  // UPDATE QTY
  const updateQty = (id, qty) => {
    const newQty = Math.max(1, qty);

    setCart((prev) => {
      const updated = prev.map((i) =>
        i.id === id ? { ...i, qty: newQty } : i
      );

      saveToFirestore(updated.find((i) => i.id === id));

      return updated;
    });
  };

  // REMOVE ITEM
  const removeFromCart = async (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));

    const user = auth.currentUser;
    if (user) {
      await deleteDoc(doc(db, "users", user.uid, "cart", id));
    }
  };

  // CLEAR CART
  const clearCart = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Clear UI cart instantly
    setCart([]);

    const cartRef = collection(db, "users", user.uid, "cart");
    const snap = await getDocs(cartRef);

    snap.forEach(async (d) => {
      await deleteDoc(doc(db, "users", user.uid, "cart", d.id));
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
