// ============================================================
// context/ThemeContext.tsx
// React Context API for UI preferences — separate from Redux.
//
// WHY separate from Redux?
//   Redux = server/app data (tasks, filters, loading state)
//   Context = pure UI preferences (theme, sidebar, layout)
//   Mixing them would make Redux messy with non-data concerns.
//
// This context manages:
//   - theme       → "light" or "dark"  (persisted to localStorage)
//   - sidebarOpen → is the sidebar open or closed
//   - compactView → show tasks in compact or full card view
// ============================================================

"use client"; // Must be client component — uses browser APIs (localStorage, useState)

import {
  createContext, // Creates the context object
  useContext, // Hook to read the context value in child components
  useState, // Local state for UI preferences
  useEffect, // To read/write localStorage
  ReactNode, // Type for children prop
} from "react";

// ============================================================
// 1. CONTEXT VALUE SHAPE — exact interface from the spec
// ============================================================
interface ThemeContextValue {
  theme: "light" | "dark"; // Current theme
  toggleTheme: () => void; // Switches between light and dark

  sidebarOpen: boolean; // Is the sidebar currently visible?
  toggleSidebar: () => void; // Opens/closes the sidebar

  compactView: boolean; // Are task cards in compact mode?
  toggleCompactView: () => void; // Toggles between compact and full view
}

// ============================================================
// 2. CREATE THE CONTEXT
// We must provide a default value for TypeScript safety.
// createContext<ThemeContextValue>(undefined!) is a common pattern —
// we'll throw an error if someone uses the hook outside the provider.
// ============================================================
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================
// 3. PROVIDER COMPONENT
// Wrap the entire app with this so all children can access the context.
// ============================================================

// Props for the provider — only needs children
interface ThemeProviderProps {
  children: ReactNode; // All nested components
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // ---- theme state (persisted to localStorage) ----
  // Initialize from localStorage if available, else default to "light"
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // typeof window !== "undefined" checks we're in the browser (not SSR)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme"); // Read saved theme
      // Only use saved value if it's valid
      if (saved === "light" || saved === "dark") return saved;
    }
    return "light"; // Default theme
  });

  // ---- sidebarOpen state (not persisted — resets on refresh) ----
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ---- compactView state (not persisted — resets on refresh) ----
  const [compactView, setCompactView] = useState(false);

  // ---- Persist theme to localStorage whenever it changes ----
  // useEffect runs AFTER the component renders
  // The [theme] dependency means this runs every time theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme); // Save to browser storage
  }, [theme]); // Only re-run when theme changes

  // ---- Action functions ----

  // toggleTheme: switches between "light" and "dark"
  // prev => prev === "light" ? "dark" : "light" means:
  //   if current is "light", return "dark", and vice versa
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // toggleSidebar: flips sidebarOpen between true and false
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // "!" negates the boolean
  };

  // toggleCompactView: flips compactView between true and false
  const toggleCompactView = () => {
    setCompactView((prev) => !prev);
  };

  // ---- Build the context value object ----
  // This is what any child component will get when it calls useTheme()
  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    compactView,
    toggleCompactView,
  };

  return (
    // ThemeContext.Provider makes the value available to all children
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// ============================================================
// 4. CUSTOM HOOK — useTheme()
// Components call useTheme() to get the context value.
// This is cleaner than writing useContext(ThemeContext) everywhere.
//
// Example usage in a component:
//   const { theme, toggleTheme } = useTheme();
// ============================================================
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  // Safety check: throw if someone uses useTheme() without ThemeProvider
  // This helps catch bugs early during development
  if (context === undefined) {
    throw new Error(
      "useTheme() must be used inside a <ThemeProvider>. " +
        "Make sure ThemeProvider wraps your app in layout.tsx.",
    );
  }

  return context;
}

// Also export the context itself in case someone needs it directly
export default ThemeContext;
