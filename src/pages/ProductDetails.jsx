import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { getProductByCustomId } from "../utlis/firestoreProducts";
import ProductDetailsSkeleton from "../components/ProductDetailsSkeleton";
import Recommendations from "../components/Recommendations";
import { CartContext } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart } = useContext(CartContext);

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductByCustomId(id);

      setProduct(data);

      if (data) {
        const defaultVariant =
          data.variants?.length > 0 ? data.variants[0] : null;

        setSelectedVariant(defaultVariant);

        const gallery = [...(data.images || [])].filter(Boolean);
        setSelectedImage(gallery[0] || "/no-image.png");
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // LOADING SKELETON
  if (loading) return <ProductDetailsSkeleton />;

  // PRODUCT NOT FOUND
  if (!product)
    return (
      <div className="p-10 text-center text-red-600 text-xl font-semibold">
        Product Not Found!
      </div>
    );

  // SAVING LOGIC
  const getSaving = (variant) => {
    const save = variant.mrp - variant.offerPrice;
    const percent = Math.round((save / variant.mrp) * 100);
    return { save, percent };
  };

  const galleryImages = [...(product.images || [])].filter(Boolean);

  // CREATE CART ID FOR CHECKING
  const variantKey =
    selectedVariant?.size ||
    selectedVariant?.flavour ||
    "default";

  const cartId = `${product.id}-${variantKey}`;

  const alreadyInCart = cart.some((item) => item.id === cartId);

  // ADD TO CART HANDLER
  const handleAdd = () => {
    const ok = addToCart(product, selectedVariant);

    if (!ok) {
      toast.error("Please login to add items");
      return;
    }

    toast.success("Added to cart");
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT SIDE - IMAGES */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            key={selectedImage}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-80 md:h-130 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center"
          >
            <img
              src={selectedImage}
              className="w-full h-full object-cover"
              alt={product.name}
            />
          </motion.div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-scroll p-2">
              {galleryImages.map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  whileHover={{ scale: 1.1 }}
                  className={`w-20 h-20 rounded-lg cursor-pointer border object-cover ${
                    img === selectedImage
                      ? "border-blue-600 shadow-md"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* RIGHT SIDE - INFO */}
        <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-sm text-gray-500">
            {product.category} → {product.subCategory}
          </p>

          {/* PRICE */}
          <div className="mt-4">
            <p className="text-3xl font-bold text-green-600">
              ₹{selectedVariant.offerPrice}
            </p>

            <p className="line-through text-sm text-gray-400">
              MRP: ₹{selectedVariant.mrp}
            </p>

            <p className="text-blue-600 text-sm">
              You save ₹{getSaving(selectedVariant).save} (
              {getSaving(selectedVariant).percent}%)
            </p>
          </div>

          {/* VARIANT INFO */}
          {selectedVariant.size && <p className="mt-2">Size: {selectedVariant.size}</p>}
          {selectedVariant.packOf && <p>Pack of: {selectedVariant.packOf}</p>}
          {selectedVariant.flavour && <p>Flavour: {selectedVariant.flavour}</p>}

          {/* VARIANT SELECTOR */}
          {product.variants.length > 1 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-2">Select Variant</h3>

              <div className="flex gap-3 overflow-x-scroll p-2">
                {product.variants.map((v, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedVariant(v)}
                    whileHover={{ scale: 1.05 }}
                    className={`border rounded-lg px-3 py-3 cursor-pointer min-w-[200px] ${
                      selectedVariant === v
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-blue-50"
                    }`}
                  >
                    {v.size && <p>Size: {v.size}</p>}
                    {v.flavour && <p>Flavour: {v.flavour}</p>}
                    {v.packOf && <p>Pack of: {v.packOf}</p>}

                    <p className="line-through text-xs">₹{v.mrp}</p>
                    <p
                      className={`font-bold ${
                        selectedVariant === v ? "text-white" : "text-green-500"
                      }`}
                    >
                      ₹{v.offerPrice}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ADD TO CART / VIEW CART */}
          {alreadyInCart ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg"
              onClick={() => navigate("/cart")}
            >
              View Cart
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={handleAdd}
            >
              Add to Cart
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold">About the Product</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>

      {/* RECOMMENDATIONS */}
      <Recommendations currentProduct={product} />
    </motion.div>
  );
}
