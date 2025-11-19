import React, { useEffect, useState } from "react";
import { getAllProducts } from "../utlis/firestoreProducts";
import ItemCart from "./ItemCart";

export default function Recommendations({ currentProduct }) {
  const [allProducts, setAllProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);

  // Load all products from Firestore
  useEffect(() => {
    const load = async () => {
      const products = await getAllProducts();
      setAllProducts(products);
    };
    load();
  }, []);

  // Generate recommendations when products are loaded
  useEffect(() => {
    if (!currentProduct || allProducts.length === 0) return;

    const filtered = allProducts.filter((p) => {
      if (p.id === currentProduct.id) return false; // skip current product

      const sameCategory = p.category === currentProduct.category;
      const sameSub = p.subCategory === currentProduct.subCategory;

      // tag match logic (safe check)
      const tagMatch =
        p.tags?.some((tag) => currentProduct.tags?.includes(tag)) || false;

      return sameCategory || sameSub || tagMatch;
    });

    setRecommended(filtered.slice(0, 4)); // limit to 4
  }, [currentProduct, allProducts]);

  // Nothing to show
  if (!currentProduct) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>

      {recommended.length === 0 && (
        <p className="text-gray-500">No similar products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recommended.map((item) => (
          <ItemCart item={item} key={item.firebaseId} />
        ))}
      </div>
    </div>
  );
}
