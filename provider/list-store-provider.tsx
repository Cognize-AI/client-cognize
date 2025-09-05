"use client";

import { createListStore, ListStore } from "@/store/list-store";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

export type ListStoreApi = ReturnType<typeof createListStore>;

export const ListStoreContext = createContext<ListStoreApi | undefined>(
  undefined,
);

export interface ListStoreProviderProps {
  children: React.ReactNode;
}

export const ListStoreProvider = ({ children }: ListStoreProviderProps) => {
  const storeRef = useRef<ListStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createListStore();
  }

  return (
    <ListStoreContext.Provider value={storeRef.current}>
      {children}
    </ListStoreContext.Provider>
  );
};

export const useListStore = <T,>(selector: (state: ListStore) => T): T => {
  const listStoreContext = useContext(ListStoreContext);

  if (!listStoreContext) {
    throw new Error("useListStore must be used within a ListStoreProvider");
  }

  return useStore(listStoreContext, selector);
};
