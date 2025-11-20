import React, { useState } from "react";
import { addProduct } from "../utlis/firestoreProducts";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    id: "",
    category: "",
    subCategory: "",
    description: "",
    mainImage: "",
    images: [""],
    tags: [""],
    variants: [
      { size: "", flavour: "", packOf: "", mrp: "", offerPrice: "", stock: "" },
    ],
    outOfStock: false,
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const updateArray = (index, value, field) => {
    const updated = [...product[field]];
    updated[index] = value;
    setProduct({ ...product, [field]: updated });
  };

  const addArrayItem = (field) => {
    setProduct({ ...product, [field]: [...product[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const updated = product[field].filter((_, i) => i !== index);
    setProduct({ ...product, [field]: updated });
  };

  const updateVariant = (i, key, value) => {
    const updated = [...product.variants];
    updated[i][key] = value;
    setProduct({ ...product, variants: updated });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: "", flavour: "", packOf: "", mrp: "", offerPrice: "", stock: "" },
      ],
    });
  };

  const removeVariant = (index) => {
    setProduct({
      ...product,
      variants: product.variants.filter((_, i) => i !== index),
    });
  };

  const saveProduct = async () => {
    if (!product.name || !product.id || !product.category) {
      return toast.error("Name, ID & Category are required");
    }

    try {
      setLoading(true);
      const updatedProduct = {
        ...product,
        images: product.images.filter((x) => x.trim() !== ""),
        tags: product.tags.filter((x) => x.trim() !== ""),
      };

      await addProduct(updatedProduct);
      toast.success("Product added!");
      navigate("/admin/products");
      console.log("done")
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product!");
            console.log("not done")

    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <div className="bg-white p-6 rounded-xl shadow space-y-5">
        <input
          name="name"
          placeholder="Product Name"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />
        <input
          name="id"
          placeholder="Custom Product ID (d1, b4…)"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Category (Baby Care, Women Care...)"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />
        <input
          name="subCategory"
          placeholder="Subcategory"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 rounded w-full h-28"
          onChange={handleChange}
        />
        <input
          name="mainImage"
          placeholder="Main Image URL"
          className="border p-2 rounded w-full"
          onChange={handleChange}
        />
        <div>
          <p className="font-semibold mb-2">Gallery Images</p>
          {product.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={img}
                onChange={(e) => updateArray(i, e.target.value, "images")}
                className="border p-2 rounded flex-1"
                placeholder="Image URL"
              />
              {i > 0 && (
                <button
                  onClick={() => removeArrayItem("images", i)}
                  className="p-2 bg-red-100 rounded text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayItem("images")}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded"
          >
            <Plus size={18} /> Add Image
          </button>
        </div>
        <div>
          <p className="font-semibold mb-2">Tags</p>
          {product.tags.map((tag, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={tag}
                onChange={(e) => updateArray(i, e.target.value, "tags")}
                className="border p-2 rounded flex-1"
                placeholder="Tag"
              />
              {i > 0 && (
                <button
                  onClick={() => removeArrayItem("tags", i)}
                  className="p-2 bg-red-100 rounded text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayItem("tags")}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded"
          >
            <Plus size={18} /> Add Tag
          </button>
        </div>
        <div>
          <p className="font-semibold mb-2">Variants</p>
          {product.variants.map((v, i) => (
            <div key={i} className="border p-4 rounded-lg mb-3 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Size (nb, s, m...)"
                  value={v.size}
                  className="border p-2 rounded w-full"
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                />
                <input
                  placeholder="Flavour (if any)"
                  value={v.flavour}
                  className="border p-2 rounded w-full"
                  onChange={(e) => updateVariant(i, "flavour", e.target.value)}
                />
                <input
                  placeholder="Pack Of"
                  value={v.packOf}
                  className="border p-2 rounded w-full"
                  onChange={(e) => updateVariant(i, "packOf", e.target.value)}
                />
                <input
                  placeholder="MRP"
                  value={v.mrp}
                  type="number"
                  className="border p-2 rounded w-full"
                  onChange={(e) =>
                    updateVariant(i, "mrp", e.target.value)
                  }
                />
                <input
                  placeholder="Offer Price"
                  value={v.offerPrice}
                  type="number"
                  className="border p-2 rounded w-full"
                  onChange={(e) =>
                    updateVariant(i, "offerPrice", e.target.value)
                  }
                />
                <input
                  placeholder="Stock"
                  value={v.stock}
                  type="number"
                  className="border p-2 rounded w-full"
                  onChange={(e) =>
                    updateVariant(i, "stock", e.target.value)
                  }
                />
              </div>
              {i > 0 && (
                <button
                  onClick={() => removeVariant(i)}
                  className="mt-3 p-2 bg-red-100 rounded text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={18} /> Remove Variant
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addVariant}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded"
          >
            <Plus size={18} /> Add Variant
          </button>
        </div>
        <motion.button
          whileHover={!loading && { scale: 1.05 }}
          whileTap={!loading && { scale: 0.95 }}
          onClick={saveProduct}
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg mt-4 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Add Product"}
        </motion.button>
      </div>
    </motion.div>
  );
}
