import React, { useState, useEffect, useMemo } from "react";
import { getAllProducts } from "../utlis/firestoreProducts";
import ItemCart from "../components/ItemCart";
import ProductSkeleton from "../components/ProductSkeleton";
import { useLocation } from "react-router-dom";

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  // 👉 READ URL QUERY PARAMS
  const { search: queryString } = useLocation();
  const params = new URLSearchParams(queryString);

  const urlCategory = params.get("category");
  const urlSubCategory = params.get("subCategory");

  // Load products from Firestore
  useEffect(() => {
    getAllProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // 👉 APPLY URL FILTERS AUTOMATICALLY
  useEffect(() => {
    if (urlCategory) setCategory(urlCategory);
    if (urlSubCategory) setSubCategory(urlSubCategory);
  }, [urlCategory, urlSubCategory]);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const list = ["All"];
    products.forEach((p) => {
      if (!list.includes(p.category)) list.push(p.category);
    });
    return list;
  }, [products]);

  // Extract subcategories dynamically
  const subCategories = useMemo(() => {
    if (category === "All") return ["All"];

    const list = ["All"];
    products
      .filter((p) => p.category === category)
      .forEach((p) => {
        if (!list.includes(p.subCategory)) list.push(p.subCategory);
      });

    return list;
  }, [category, products]);

  // FILTERING LOGIC
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search filter
    if (search.trim() !== "") {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category !== "All") {
      data = data.filter((p) => p.category === category);
    }

    // Subcategory filter
    if (subCategory !== "All") {
      data = data.filter((p) => p.subCategory === subCategory);
    }

    // Sorting
    if (sort === "low-high") {
      data.sort(
        (a, b) =>
          (a.variants?.[0]?.offerPrice || a.offerPrice) -
          (b.variants?.[0]?.offerPrice || b.offerPrice)
      );
    }

    if (sort === "high-low") {
      data.sort(
        (a, b) =>
          (b.variants?.[0]?.offerPrice || b.offerPrice) -
          (a.variants?.[0]?.offerPrice || a.offerPrice)
      );
    }

    return data;
  }, [search, category, subCategory, sort, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Products</h1>

      {/* FILTER BOX */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search product..."
          className="border p-2 rounded-lg w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="border p-2 rounded-lg"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("All");
          }}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Subcategory Filter */}
        <select
          className="border p-2 rounded-lg"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
        >
          {subCategories.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="border p-2 rounded-lg"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">

        {/* Skeleton Loading */}
        {loading &&
          Array(8)
            .fill(0)
            .map((_, i) => <ProductSkeleton key={i} />)}

        {/* No products */}
        {!loading && filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}

        {/* Products */}
        {!loading &&
          filteredProducts.map((item) => (
            <ItemCart item={item} key={item.firebaseId} />
          ))}
      </div>

    </div>
  );
}
