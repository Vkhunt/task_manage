// ============================================================
// components/Navbar.tsx
// The navigation bar shown at the top of every page.
// ============================================================

"use client"; // Client component because we use hooks and links

import Link from "next/link"; // Next.js link component for navigation
import { usePathname } from "next/navigation"; // Hook to know current URL path
import { CheckSquare, Plus, List, LayoutDashboard } from "lucide-react"; // Icons
import { cn } from "@/lib/utils"; // Our class name helper

// Define the navigation links array
// Each link has a label, href (URL), and an icon component
const navLinks = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "All Tasks", href: "/tasks", icon: List },
  { label: "Create Task", href: "/create", icon: Plus },
];

export default function Navbar() {
  // usePathname() returns the current URL path (e.g., "/tasks")
  const pathname = usePathname();

  return (
    // <nav> is a semantic HTML element for navigation
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ---- LOGO / BRAND ---- */}
          <Link href="/" className="flex items-center gap-2">
            {/* CheckSquare is a Lucide icon */}
            <CheckSquare className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Task<span className="text-blue-600">Manager</span>
            </span>
          </Link>

          {/* ---- NAVIGATION LINKS ---- */}
          <div className="flex items-center gap-1">
            {/* Map over navLinks array to render each link */}
            {navLinks.map((link) => {
              // Check if this link is the active page
              const isActive = pathname === link.href;
              // Get the icon component (starts with capital letter = component)
              const Icon = link.icon;

              return (
                <Link
                  key={link.href} // key needed for list items in React
                  href={link.href}
                  className={cn(
                    // Base styles for all links
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    // Conditional styles: active = blue, inactive = gray
                    isActive
                      ? "bg-blue-50 text-blue-600" // Active link style
                      : "text-gray-600 hover:bg-gray-100", // Inactive link style
                  )}
                >
                  {/* Render the icon at 16x16 pixels */}
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
