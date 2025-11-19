import React, { useEffect, useState } from "react";
import { getAllProducts } from "../utlis/firestoreProducts";
import ItemCart from "../components/ItemCart";
import ProductSkeleton from "../components/ProductSkeleton";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    getAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Create categories
  const categories = [
    {
      name: "Baby Care",
      url: "https://res.cloudinary.com/dqeudkhoz/image/upload/v1763524411/Gemini_Generated_Image_lddyw8lddyw8lddy_r88t52.png",
    },
    {
      name: "Women Care",
      url: "https://res.cloudinary.com/dqeudkhoz/image/upload/v1763524637/Gemini_Generated_Image_fna4mfna4mfna4mf_efsirt.png",
    },
    {
      name: "Hair Care",
      url: "https://res.cloudinary.com/dqeudkhoz/image/upload/v1763524653/Gemini_Generated_Image_yzozsbyzozsbyzoz_snrc4x.png",
    },
    {
      name: "Skin & Body Care",
      url: "https://res.cloudinary.com/dqeudkhoz/image/upload/v1763524699/Gemini_Generated_Image_oa7y45oa7y45oa7y_siauvo.png",
    },
    {
      name: "Household Care",
      url: "https://res.cloudinary.com/dqeudkhoz/image/upload/v1763524739/Gemini_Generated_Image_ue3e16ue3e16ue3e_hkizkx.png",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* HERO */}
      <Hero />

      {/* CATEGORY SECTION */}
      <motion.h2
        className="text-xl font-semibold mt-8 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        Shop by Category
      </motion.h2>

      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {categories.map((c) => (
          <motion.div
            key={c.name}
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              to={`/all?category=${encodeURIComponent(c.name)}`}
              className="bg-white shadow-sm rounded-full hover:shadow-md transition"
            >
              <img
                src={c.url}
                alt={c.name}
                className="h-30 w-30 sm:h-50 sm:w-50 rounded-full"
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* FEATURED PRODUCTS */}
      <motion.h2
        className="text-xl font-semibold mt-10 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Featured Products
      </motion.h2>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => <ProductSkeleton key={i} />)}

        {!loading &&
          products.slice(0, 4).map((p) => (
            <motion.div
              key={p.firebaseId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ItemCart item={p} />
            </motion.div>
          ))}
      </motion.div>

      {/* BABY CARE SECTION */}
      <motion.h2
        className="text-xl font-semibold mt-10 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Baby Care
      </motion.h2>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => <ProductSkeleton key={i} />)}

        {!loading &&
          products
            .filter((p) => p.category === "Baby Care")
            .slice(0, 4)
            .map((p) => (
              <motion.div
                key={p.firebaseId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ItemCart item={p} />
              </motion.div>
            ))}
      </motion.div>

      {/* HAIR & SKIN SECTION */}
      <motion.h2
        className="text-xl font-semibold mt-10 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Hair & Skin Care
      </motion.h2>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {loading &&
          Array(4)
            .fill(0)
            .map((_, i) => <ProductSkeleton key={i} />)}

        {!loading &&
          products
            .filter(
              (p) =>
                p.category === "Hair Care" ||
                p.category === "Skin & Body Care"
            )
            .slice(0, 4)
            .map((p) => (
              <motion.div
                key={p.firebaseId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ItemCart item={p} />
              </motion.div>
            ))}
      </motion.div>

      {/* BUTTON → ALL PRODUCTS */}
      <motion.div
        className="text-center mt-10"
        whileHover={{ scale: 1.05 }}
      >
        <Link
          to="/all"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
        >
          View All Products
        </Link>
      </motion.div>
    </div>
  );
}
