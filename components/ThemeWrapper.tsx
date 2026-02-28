// ============================================================
// components/ThemeWrapper.tsx
// Client component that:
//   1. Wraps the app with ThemeProvider (provides context to all children)
//   2. Reads the current theme from ThemeContext
//   3. Applies data-theme="light|dark" to the root <html> element
//
// WHY a separate component?
//   layout.tsx is a SERVER component and can't use hooks.
//   We need a client component to read the context and update the DOM.
// ============================================================

"use client";

import { useEffect } from "react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// ---- Inner component that reads context and sets data-theme ----
// This is separate so it can use useTheme() (which requires ThemeProvider above it)
function ThemeApplier({ children }: { children: React.ReactNode }) {
  // Read the current theme from ThemeContext
  // This re-renders automatically when theme changes (e.g. after toggleTheme())
  const { theme } = useTheme();

  // useEffect runs after render — sets data-theme on the <html> tag
  // document.documentElement = the <html> element
  useEffect(() => {
    // Set: <html data-theme="light"> or <html data-theme="dark">
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]); // Re-runs every time theme changes

  // Just render children — this component only adds a side effect
  return <>{children}</>;
}

// ---- Exported ThemeWrapper ----
// Wraps children with ThemeProvider + ThemeApplier
// Usage in layout.tsx:
//   <ThemeWrapper>
//     <Navbar />
//     <main>...</main>
//   </ThemeWrapper>
export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ThemeProvider must be the outer wrapper
    // so ThemeApplier (inside) can call useTheme()
    <ThemeProvider>
      <ThemeApplier>{children}</ThemeApplier>
    </ThemeProvider>
  );
}
