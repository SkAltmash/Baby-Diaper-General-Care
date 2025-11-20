import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllProducts, deleteProduct, updateProduct } from "../utlis/firestoreProducts";
import { toast } from "react-hot-toast";
import { Trash2, Edit, CheckCircle, XCircle } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    const ok = await deleteProduct(id);
    if (ok) {
      toast.success("Product deleted!");
      setProducts((prev) => prev.filter((p) => p.firebaseId !== id));
    } else toast.error("Failed to delete");
  };

  const toggleStock = async (p) => {
    const updated = !p.outOfStock;

    await updateProduct(p.firebaseId, { outOfStock: updated });

    toast.success(updated ? "Marked Out of Stock" : "Back in Stock");

    setProducts((prev) =>
      prev.map((item) =>
        item.firebaseId === p.firebaseId ? { ...item, outOfStock: updated } : item
      )
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin – Products</h1>

        <Link
          to="/admin/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="space-y-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-500">No products found</p>
      )}

      {/* PRODUCT LIST */}
      <div className="space-y-4">
        {products.map((p) => (
          <motion.div
            key={p.firebaseId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow flex gap-4 items-center"
          >
            {/* IMAGE */}
            <img
              src={p.mainImage || p.images?.[0] || "/no-image.png"}
              className="w-16 h-16 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-500">
                {p.category} → {p.subCategory}
              </p>
              <p className="text-green-600 font-semibold">
                Starting at ₹{p.offerPrice || p.variants?.[0]?.offerPrice}
              </p>

              {p.outOfStock && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => toggleStock(p)}
                className={`p-2 rounded-full ${
                  p.outOfStock
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {p.outOfStock ? <CheckCircle size={20} /> : <XCircle size={20} />}
              </button>

              <Link
                to={`/admin/edit-product/${p.firebaseId}`}
                className="p-2 bg-blue-100 text-blue-600 rounded-full"
              >
                <Edit size={20} />
              </Link>

              <button
                onClick={() => handleDelete(p.firebaseId)}
                className="p-2 bg-red-100 text-red-600 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
