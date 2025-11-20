import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductByFirebaseId,
  updateProduct,
} from "../utlis/firestoreProducts";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Plus, Trash } from "lucide-react";

export default function AdminEditProduct() {
  const { firebaseId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product by Firestore ID
  useEffect(() => {
    const load = async () => {
      const data = await getProductByFirebaseId(firebaseId);
      setProduct(data);
      setLoading(false);
    };
    load();
  }, [firebaseId]);

  const updateField = (key, value) => {
    setProduct({ ...product, [key]: value });
  };

  const updateVariant = (index, key, value) => {
    const newVariants = [...product.variants];
    newVariants[index][key] = value;
    setProduct({ ...product, variants: newVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: "", packOf: "", mrp: "", offerPrice: "", stock: "" },
      ],
    });
  };

  const removeVariant = (index) => {
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: newVariants });
  };

  const addImage = () => {
    setProduct({ ...product, images: [...product.images, ""] });
  };

  const updateImage = (i, value) => {
    const updated = [...product.images];
    updated[i] = value;
    setProduct({ ...product, images: updated });
  };

  const removeImage = (i) => {
    const updated = product.images.filter((_, index) => index !== i);
    setProduct({ ...product, images: updated });
  };

  const saveProduct = async () => {
    setLoading(true);

    const success = await updateProduct(firebaseId, product);

    if (success) {
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } else {
      toast.error("Failed to update product!");
    }
    setLoading(false);
  };

  if (loading || !product)
    return (
      <div className="text-center p-10 text-lg text-gray-500">
        Loading product…
      </div>
    );

  return (
    <motion.div
      className="max-w-5xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-5">

        {/* NAME */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        {/* CATEGORY */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Category"
          value={product.category}
          onChange={(e) => updateField("category", e.target.value)}
        />

        {/* SUBCATEGORY */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Sub Category"
          value={product.subCategory}
          onChange={(e) => updateField("subCategory", e.target.value)}
        />

        {/* TAGS */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Tags (comma separated)"
          value={product.tags.join(", ")}
          onChange={(e) =>
            updateField("tags", e.target.value.split(",").map((t) => t.trim()))
          }
        />

        {/* DESCRIPTION */}
        <textarea
          className="border p-2 rounded w-full h-32"
          placeholder="Description"
          value={product.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        {/* MAIN IMAGE */}
        <div>
          <p className="font-semibold mb-1">Main Image</p>
          <input
            className="border p-2 rounded w-full"
            placeholder="Main Image URL"
            value={product.mainImage}
            onChange={(e) => updateField("mainImage", e.target.value)}
          />
        </div>

        {/* GALLERY IMAGES */}
        <div>
          <p className="font-semibold mb-2">Gallery Images</p>
          {product.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="border p-2 rounded w-full"
                placeholder="Image URL"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
              />
              <button
                onClick={() => removeImage(i)}
                className="bg-red-500 text-white p-2 rounded"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={addImage}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
          >
            <Plus size={18} /> Add Image
          </button>
        </div>

        {/* VARIANTS */}
        <div>
          <p className="font-semibold text-lg mb-2">Variants</p>

          {product.variants.map((v, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 mb-4 bg-gray-50 shadow"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                <input
                  className="border p-2 rounded"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Pack Of"
                  value={v.packOf}
                  onChange={(e) => updateVariant(i, "packOf", e.target.value)}
                />

                <input
                  className="border p-2 rounded"
                  placeholder="MRP"
                  type="number"
                  value={v.mrp}
                  onChange={(e) => updateVariant(i, "mrp", Number(e.target.value))}
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Offer Price"
                  type="number"
                  value={v.offerPrice}
                  onChange={(e) =>
                    updateVariant(i, "offerPrice", Number(e.target.value))
                  }
                />

                <input
                  className="border p-2 rounded"
                  placeholder="Stock"
                  type="number"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(i, "stock", Number(e.target.value))
                  }
                />
              </div>

              <button
                onClick={() => removeVariant(i)}
                className="mt-3 bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Trash size={16} /> Remove Variant
              </button>
            </div>
          ))}

          <button
            onClick={addVariant}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} /> Add Variant
          </button>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveProduct}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </motion.div>
  );
}
