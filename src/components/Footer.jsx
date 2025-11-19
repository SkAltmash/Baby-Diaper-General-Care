import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-gray-200 mt-10 pt-10 pb-6">

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div>
                 <img src="/logo.png" className="h-25 w-25 rounded-full object-cover" alt="" />

                    <h2 className="text-xl font-bold text-white mb-3">
                        Baby Diaper & General Care
                    </h2>
                    <p className="text-sm text-gray-300">
                        Trusted store for Baby Care, Women Hygiene, Home Essentials & Daily Needs.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link className="hover:text-white" to="/">Home</Link></li>
                        <li><Link className="hover:text-white" to="/all">Products</Link></li>
                        <li><Link className="hover:text-white" to="/cart">Cart</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
                    <ul className="space-y-2 text-sm">

                        <li>
                            <Link className="hover:text-white"
                                to={`/all?category=${encodeURIComponent("Baby Care")}`}>
                                Baby Care
                            </Link>
                        </li>

                        <li>
                            <Link className="hover:text-white"
                                to={`/all?category=${encodeURIComponent("Women Care")}`}>
                                Women Care
                            </Link>
                        </li>

                        <li>
                            <Link className="hover:text-white"
                                to={`/all?category=${encodeURIComponent("Hair Care")}`}>
                                Hair Care
                            </Link>
                        </li>

                        <li>
                            <Link className="hover:text-white"
                                to={`/all?category=${encodeURIComponent("Skin & Body Care")}`}>
                                Skin & Body Care
                            </Link>
                        </li>

                        <li>
                            <Link className="hover:text-white"
                                to={`/all?category=${encodeURIComponent("Household Care")}`}>
                                Household Care
                            </Link>
                        </li>

                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>

                    {/* Phone */}
                    <div className="flex items-center gap-2 mb-2">
                        <Phone size={18} />
                        <p>92843 55735</p>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-center gap-2 mb-2">
                        <MessageCircle size={18} />
                        <p>+91 92843 55735</p>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2 mb-2">
                        <Mail size={18} />
                        <p>support@babydiaperstore.com</p>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} />
                        <p>
                            Ground Floor, Jama Masjid Complex,
                            <br /> Hinganghat, Maharashtra
                        </p>
                    </div>
                </div>

            </div>

            {/* CTA BUTTON */}
            <div className="max-w-7xl mx-auto px-6 mt-8 text-center flex flex-wrap justify-center gap-3">

                {/* WhatsApp CTA */}
                <a
                    href="https://wa.me/919284355735?text=Hi%20I%20want%20to%20order%20products"
                    target="_blank"
                    className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-green-600 transition"
                >
                    Order on WhatsApp
                </a>

                {/* Get Directions CTA */}
                <a
                    href="https://maps.app.goo.gl/hGXsTY8McQwLMd7UA"
                    target="_blank"
                    className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-red-600 transition inline-flex items-center gap-2"
                >
                    <MapPin size={20} />
                    Get Directions
                </a>

            </div>

      {/* BOTTOM STRIP */}
<div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-gray-200">
  © {new Date().getFullYear()} Baby Diaper & General Care — All Rights Reserved.
  <br />
  <span className="text-gray-300 text-xl mt-5">
    Designed & Developed by{" "}
    <a
      href="https://altamashdev.netlify.app/"
      target="_blank"
      className="text-yellow-300 font-semibold hover:underline hover:text-yellow-200 transition"
    >
      Sk Altamash
    </a>
  </span>
</div>
        </footer>
    );
}
