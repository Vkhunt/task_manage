// ============================================================
// components/Providers.tsx
// This wraps our entire app with all the "providers" it needs.
// Providers give components access to global state.
//
// "use client" = this component runs in the browser (not server)
// It's needed because Redux uses browser state
// ============================================================

"use client";

import { Provider } from "react-redux"; // React-Redux provider
import { store } from "@/store"; // Our Redux store

// Props type - Providers accepts "children" (all nested components)
interface ProvidersProps {
  children: React.ReactNode; // ReactNode = any valid React content
}

// This component wraps children with the Redux Provider
// The Provider makes the store accessible to all child components
export default function Providers({ children }: ProvidersProps) {
  return (
    // <Provider store={store}> gives all children access to Redux state
    <Provider store={store}>{children}</Provider>
  );
}
