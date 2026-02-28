"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;

  compactView: boolean;
  toggleCompactView: () => void;
}


const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);




interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {

  const [theme, setTheme] = useState<"light" | "dark">(() => {

    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");

      if (saved === "light" || saved === "dark") return saved;
    }
    return "light";
  });


  const [sidebarOpen, setSidebarOpen] = useState(false);


  const [compactView, setCompactView] = useState(false);


  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);




  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };


  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };


  const toggleCompactView = () => {
    setCompactView((prev) => !prev);
  };


  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    compactView,
    toggleCompactView,
  };

  return (

    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}


export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);


  if (context === undefined) {
    throw new Error(
      "useTheme() must be used inside a <ThemeProvider>. " +
        "Make sure ThemeProvider wraps your app in layout.tsx.",
    );
  }

  return context;
}


export default ThemeContext;
