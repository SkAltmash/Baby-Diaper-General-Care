import React, { useState } from "react";
import { addProduct } from "../utlis/firestoreProducts";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../utlis/uploadToCloudinary";

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
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Upload Main Image
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading("Uploading main image...");
    const url = await uploadToCloudinary(file);
    toast.dismiss();
    toast.success("Image uploaded!");

    setProduct({ ...product, mainImage: url });
  };

  // Upload Gallery Image
  const handleGalleryUpload = async (index, file) => {
    toast.loading("Uploading image...");

    const url = await uploadToCloudinary(file);

    toast.dismiss();
    toast.success("Image uploaded!");

    const updated = [...product.images];
    updated[index] = url;

    setProduct({ ...product, images: updated });
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product!");
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
        {/* Basic Inputs */}
        <input name="name" placeholder="Product Name" className="border p-2 rounded w-full" onChange={handleChange} />
        <input name="id" placeholder="Custom Product ID" className="border p-2 rounded w-full" onChange={handleChange} />
        <input name="category" placeholder="Category" className="border p-2 rounded w-full" onChange={handleChange} />
        <input name="subCategory" placeholder="Subcategory" className="border p-2 rounded w-full" onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="border p-2 rounded w-full h-28" onChange={handleChange} />

        {/* MAIN IMAGE UPLOAD */}
                  <p className="font-semibold mb-2">Main Image</p>

        <div className="flex flex-col justify-between">

          {product.mainImage && (
            <img src={product.mainImage} className="w-80 h-80 object-cover rounded mb-3" />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="border p-2 h-10  rounded"
          />
        </div>

        {/* GALLERY UPLOAD */}
        <div>
          <p className="font-semibold mb-2">Gallery Images</p>

          {product.images.map((img, i) => (
            <div key={i} className="flex flex-wrap gap-3 mb-3 items-center">
              {/* Preview */}
              {img ? (
                <img src={img} className="w-80 h-80 object-cover rounded" />
              ) : (
                <div className="w-80 h-80 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleGalleryUpload(i, e.target.files[0])}
                className="border p-2 rounded flex-1"
              />

              {i > 0 && (
                <button
                  onClick={() => removeArrayItem("images", i)}
                  className="p-2 bg-red-100 text-red-600 rounded"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => addArrayItem("images")}
            className="bg-blue-600 text-white flex items-center gap-2 px-3 py-2 rounded"
          >
            <Plus size={18} /> Add Image
          </button>
        </div>

        {/* TAGS + VARIANTS (same as your existing UI) */}
        {/* ... */}

        {/* SAVE BTN */}
        <motion.button
          whileHover={!loading && { scale: 1.05 }}
          onClick={saveProduct}
          disabled={loading}
          className={`w-full py-3 mt-4 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Add Product"}
        </motion.button>
      </div>
    </motion.div>
  );
}
