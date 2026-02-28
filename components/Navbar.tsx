"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckSquare,
  Plus,
  List,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "All Tasks", href: "/tasks", icon: List },
  { label: "Create Task", href: "/create", icon: Plus },
];

export default function Navbar() {
  const pathname = usePathname();


  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Task<span className="text-blue-600">Manager</span>
            </span>
          </Link>


          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}




            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="ml-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >


              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
