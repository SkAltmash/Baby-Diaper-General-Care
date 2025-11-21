import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductByFirebaseId,
  updateProduct,
} from "../utlis/firestoreProducts";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Plus, Trash, Upload } from "lucide-react";
import { uploadToCloudinary } from "../utlis/uploadToCloudinary";

export default function AdminEditProduct() {
  const { firebaseId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product
  useEffect(() => {
    (async () => {
      const data = await getProductByFirebaseId(firebaseId);
      setProduct(data);
      setLoading(false);
    })();
  }, [firebaseId]);

  const updateField = (key, value) => setProduct({ ...product, [key]: value });

  const updateVariant = (i, field, value) => {
    const updated = [...product.variants];
    updated[i][field] = value;
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

  const removeVariant = (i) => {
    setProduct({
      ...product,
      variants: product.variants.filter((_, idx) => idx !== i),
    });
  };

  // ------- IMAGE UPLOAD --------
  const uploadMainImage = async (file) => {
    toast.loading("Uploading...");
    const url = await uploadToCloudinary(file);
    toast.dismiss();
    toast.success("Main image updated!");

    updateField("mainImage", url);
  };

  const uploadGalleryImage = async (i, file) => {
    toast.loading("Uploading...");
    const url = await uploadToCloudinary(file);
    toast.dismiss();
    toast.success("Image uploaded!");

    const updated = [...product.images];
    updated[i] = url;
    updateField("images", updated);
  };

  const addImage = () =>
    updateField("images", [...product.images, ""]);

  const removeImage = (i) =>
    updateField(
      "images",
      product.images.filter((_, idx) => idx !== i)
    );

  // ------- TAGS -------
  const updateTag = (i, value) => {
    const updated = [...product.tags];
    updated[i] = value;
    updateField("tags", updated);
  };

  const addTag = () =>
    updateField("tags", [...product.tags, ""]);

  const removeTag = (i) =>
    updateField(
      "tags",
      product.tags.filter((_, idx) => idx !== i)
    );

  // ----- SAVE PRODUCT -----
  const saveProductChanges = async () => {
    if (!product.name || !product.id || !product.category) {
      return toast.error("Name, ID & Category are required!");
    }

    setLoading(true);

    const cleanedProduct = {
      ...product,
      images: product.images.filter((x) => x.trim() !== ""),
      tags: product.tags.filter((x) => x.trim() !== ""),
    };

    const ok = await updateProduct(firebaseId, cleanedProduct);

    if (ok) {
      toast.success("Product updated!");
      navigate("/admin/products");
    } else {
      toast.error("Failed to update!");
    }

    setLoading(false);
  };

  if (loading || !product)
    return (
      <div className="text-center p-10 text-lg text-gray-500 animate-pulse">
        Loading Product...
      </div>
    );

  return (
    <motion.div
      className="max-w-5xl mx-auto p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <div className="bg-white shadow p-6 rounded-xl space-y-6">

        {/* NAME, CATEGORY */}
        <input
          className="border p-2 rounded w-full"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Category"
          value={product.category}
          onChange={(e) => updateField("category", e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Subcategory"
          value={product.subCategory}
          onChange={(e) => updateField("subCategory", e.target.value)}
        />

        {/* Description */}
        <textarea
          className="border p-2 rounded w-full h-24"
          value={product.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        {/* Out Of Stock Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={product.outOfStock || false}
            onChange={(e) => updateField("outOfStock", e.target.checked)}
          />
          <span>Mark as Out of Stock</span>
        </label>

        {/* MAIN IMAGE */}
        <div>
          <p className="font-semibold mb-2">Main Image</p>

          {product.mainImage && (
            <img
              src={product.mainImage}
              className="w-40 h-40 object-cover rounded mb-3"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadMainImage(e.target.files[0])}
            className="border rounded p-2"
          />
        </div>

        {/* GALLERY IMAGES */}
        <div>
          <p className="font-semibold">Gallery Images</p>

          {product.images.map((img, i) => (
            <div key={i} className="flex flex-wrap items-center gap-3 mb-3">
              {img ? (
                <img src={img} className="w-80 h-80 object-cover rounded" />
              ) : (
                <div className="w-80 h-80 bg-gray-200 rounded flex items-center justify-center">
                  No Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadGalleryImage(i, e.target.files[0])}
                className="border p-2 rounded"
              />

              <button
                onClick={() => removeImage(i)}
                className="p-2 bg-red-100 text-red-600 rounded"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={addImage}
            className="bg-blue-600 text-white rounded px-3 py-2 flex items-center gap-2"
          >
            <Plus size={18} /> Add Image
          </button>
        </div>

        {/* TAGS */}
        <div>
          <p className="font-semibold">Tags</p>
          {product.tags.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={t}
                onChange={(e) => updateTag(i, e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={() => removeTag(i)}
                className="bg-red-100 text-red-600 p-2 rounded"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={addTag}
            className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Add Tag
          </button>
        </div>

        {/* VARIANTS */}
        <div>
          <p className="text-lg font-semibold mb-2">Variants</p>

          {product.variants.map((v, i) => (
            <div key={i} className="border p-4 rounded-xl mb-3 bg-gray-50 shadow">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input
                  placeholder="Size"
                  value={v.size}
                  className="border p-2 rounded"
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                />
                <input
                  placeholder="Flavor"
                  value={v.flavour}
                  className="border p-2 rounded"
                  onChange={(e) => updateVariant(i, "flavour", e.target.value)}
                />
                <input
                  placeholder="Pack Of"
                  value={v.packOf}
                  className="border p-2 rounded"
                  onChange={(e) => updateVariant(i, "packOf", e.target.value)}
                />
                <input
                  placeholder="MRP"
                  type="number"
                  value={v.mrp}
                  className="border p-2 rounded"
                  onChange={(e) =>
                    updateVariant(i, "mrp", Number(e.target.value))
                  }
                />
                <input
                  placeholder="Offer Price"
                  type="number"
                  value={v.offerPrice}
                  className="border p-2 rounded"
                  onChange={(e) =>
                    updateVariant(i, "offerPrice", Number(e.target.value))
                  }
                />
                <input
                  placeholder="Stock"
                  type="number"
                  value={v.stock}
                  className="border p-2 rounded"
                  onChange={(e) =>
                    updateVariant(i, "stock", Number(e.target.value))
                  }
                />
              </div>

              <button
                onClick={() => removeVariant(i)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <Trash size={16} /> Remove Variant
              </button>
            </div>
          ))}

          <button
            onClick={addVariant}
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} /> Add Variant
          </button>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveProductChanges}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-semibold"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
