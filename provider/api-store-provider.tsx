"use client";

import { APIStore, createApiStore } from "@/store/api-store";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type APIStoreApi = ReturnType<typeof createApiStore>;
export const ApiStoreContext = createContext<APIStoreApi | undefined>(
  undefined,
);

export interface APIStoreProviderProps {
  children: React.ReactNode;
}

export const ApiStoreProvider = ({ children }: APIStoreProviderProps) => {
  const storeRef = useRef<APIStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createApiStore();
  }
  return (
    <ApiStoreContext.Provider value={storeRef.current}>
      {children}
    </ApiStoreContext.Provider>
  );
};

export const useApiStore = <T,>(selector: (state: APIStore) => T): T => {
  const apiStoreContext = useContext(ApiStoreContext);
  if (!apiStoreContext) {
    throw new Error("useApiStore must be used within a ApiStoreProvider");
  }
  return useStore(apiStoreContext, selector);
};
