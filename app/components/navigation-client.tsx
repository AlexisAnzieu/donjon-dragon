"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GiDoubleDragon } from "react-icons/gi";

type NavigationItem = {
  name: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
};

type Category = {
  title: string;
  href?: string;
  external?: boolean;
  items?: NavigationItem[];
};

function buildNavigation(
  isAuthenticated: boolean,
  onLogout: () => void
) {
  const commonCategories: Category[] = [
    {
      title: "Personnage",
      items: [
        { name: "Répondre au quiz", href: "/character-quiz" },
        { name: "Construire", href: "/character/edit" },
      ],
    },
    { title: "Monstres", href: "/monsters" },
    {
      title: "Magasins",
      items: [
        { name: "Armes", href: "/weapons" },
        { name: "Armures", href: "/armors" },
      ],
    },
  ];

  const accountCategory: Category = isAuthenticated
    ? {
        title: "Mon compte",
        items: [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Déconnexion", href: "#", onClick: onLogout },
        ],
      }
    : {
        title: "Se connecter",
        href: "/dashboard",
      };

  return [...commonCategories, accountCategory];
}

type NavigationClientProps = {
  isAuthenticated: boolean;
};

export default function NavigationClient({
  isAuthenticated,
}: NavigationClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  };

  const categories = buildNavigation(isAuthenticated, handleLogout);

  const toggleDropdown = (title: string) =>
    setActiveDropdown(activeDropdown === title ? null : title);

  return (
    <nav
      className="bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg"
      role="navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <GiDoubleDragon className="h-8 w-8 text-white" aria-hidden="true" />
            <span className="text-2xl font-bold">D&D craft</span>
          </Link>

          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <div key={category.title} className="relative group">
                <DesktopMenuItem
                  category={category}
                  toggleDropdown={toggleDropdown}
                />
              </div>
            ))}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
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

        <MobileMenu
          isOpen={mobileMenuOpen}
          categories={categories}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />
      </div>
    </nav>
  );
}

type DesktopMenuItemProps = {
  category: Category;
  toggleDropdown: (title: string) => void;
};

const DesktopMenuItem: React.FC<DesktopMenuItemProps> = ({
  category,
  toggleDropdown,
}) => {
  if (category.href) {
    const className =
      "px-3 py-2 text-white hover:bg-red-800 rounded-md transition-colors duration-200";

    if (category.external) {
      return (
        <a href={category.href} className={className} rel="noreferrer">
          {category.title}
        </a>
      );
    }

    return (
      <Link href={category.href} className={className}>
        {category.title}
      </Link>
    );
  }

  return (
    <>
      <button
        className="text-white hover:bg-red-800 rounded-md transition-colors duration-200"
        onClick={() => toggleDropdown(category.title)}
        aria-haspopup="true"
      >
        {category.title}
      </button>
      {category.items?.length ? (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-red-950 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1" role="menu">
            {category.items.map((item) => {
              if (item.onClick) {
                return (
                  <button
                    key={item.name}
                    onClick={item.onClick}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-800"
                    role="menuitem"
                  >
                    {item.name}
                  </button>
                );
              }

              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-white hover:bg-red-800"
                    role="menuitem"
                    rel="noreferrer"
                  >
                    {item.name}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-white hover:bg-red-800"
                  role="menuitem"
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};

const MobileMenu: React.FC<{
  isOpen: boolean;
  categories: Category[];
  activeDropdown: string | null;
  toggleDropdown: (title: string) => void;
}> = ({ isOpen, categories, activeDropdown, toggleDropdown }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {categories.map((category) => (
          <div key={category.title}>
            {category.href ? (
              category.external ? (
                <a
                  href={category.href}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                  rel="noreferrer"
                >
                  {category.title}
                </a>
              ) : (
                <Link
                  href={category.href}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                >
                  {category.title}
                </Link>
              )
            ) : (
              <button
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                onClick={() => toggleDropdown(category.title)}
              >
                {category.title}
              </button>
            )}
            {activeDropdown === category.title && category.items?.length ? (
              <div className="pl-4 py-2">
                {category.items.map((item) => {
                  if (item.onClick) {
                    return (
                      <button
                        key={item.name}
                        onClick={item.onClick}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-800 hover:text-white transition-colors duration-200"
                        role="menuitem"
                      >
                        {item.name}
                      </button>
                    );
                  }

                  if (item.external) {
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-red-800 hover:text-white transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
