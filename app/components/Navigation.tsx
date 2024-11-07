"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GiDoubleDragon } from "react-icons/gi";

const categories = [
  {
    title: "Personnages",
    items: [{ name: "Répond au quiz", href: "/character-quiz" }],
  },
  {
    title: "Monstres",
    href: "/monsters",
  },
];

export default function DnDNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <nav className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <GiDoubleDragon className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">H2T - D&D Index</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <div key={category.title} className="relative group">
                {category.href ? (
                  <Link
                    href={category.href}
                    className="px-3 py-2 text-white hover:bg-red-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                  >
                    {category.title}
                  </Link>
                ) : (
                  <button
                    className=" text-white hover:bg-red-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                    onClick={() => toggleDropdown(category.title)}
                  >
                    {category.title}
                  </button>
                )}

                {category.items?.length && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-red-950 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-white hover:bg-red-800 hover:text-white transition-colors duration-200"
                          role="menuitem"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              title="Ouvrir le menu mobile"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 rounded-md"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {categories.map((category) => (
              <div key={category.title}>
                {category.href ? (
                  <Link
                    href={category.href}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                  >
                    {category.title}
                  </Link>
                ) : (
                  <button
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                    onClick={() => toggleDropdown(category.title)}
                  >
                    {category.title}
                  </button>
                )}
                {activeDropdown === category.title &&
                  category.items?.length && (
                    <div className="pl-4 py-2">
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
