"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LeftNavbar() {
  const pathname = usePathname();

  const navItems = [{ href: "/dashboard", label: "Dashboard", icon: "📊" }];

  return (
    <nav className="w-64 bg-gray-50 min-h-screen p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded-lg hover:bg-gray-200 ${
                pathname === item.href ? "bg-gray-200" : ""
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
