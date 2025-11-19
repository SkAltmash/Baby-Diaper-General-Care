import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// Firestore collection reference
const productRef = collection(db, "products");


// ⭐ Fetch ALL products
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(productRef);
    return snapshot.docs.map((d) => ({
      firebaseId: d.id, // Firestore doc ID
      ...d.data(), // Actual product data
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};


// ⭐ Fetch one product by CUSTOM ID (d1, p7…)
export const getProductByCustomId = async (customId) => {
  try {
    const allProducts = await getAllProducts();
    return allProducts.find((p) => p.id === customId) || null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};


// ⭐ Fetch product by Firestore Document ID
export const getProductByFirebaseId = async (firebaseId) => {
  try {
    const docRef = doc(db, "products", firebaseId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { firebaseId, ...snap.data() };
    }

    return null;
  } catch (error) {
    console.error("Error fetching product by Firebase ID:", error);
    return null;
  }
};


// ⭐ Add new product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productRef, productData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    return null;
  }
};


// ⭐ Update product
export const updateProduct = async (firebaseId, updatedData) => {
  try {
    const docRef = doc(db, "products", firebaseId);
    await updateDoc(docRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};


// ⭐ Delete product
export const deleteProduct = async (firebaseId) => {
  try {
    await deleteDoc(doc(db, "products", firebaseId));
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};
