"use client";

import { useStore } from "zustand";
import { createContext, useContext, useRef } from "react";
import { createTagStore, TagsStore } from "@/store/tags-store";

export type TagsStoreApi = ReturnType<typeof createTagStore>;

export const TagsStoreContext = createContext<TagsStoreApi | undefined>(
  undefined,
);

export interface TagsStoreProviderProps {
  children: React.ReactNode;
}

export const TagsStoreProvider = ({ children }: TagsStoreProviderProps) => {
  const storeRef = useRef<TagsStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createTagStore();
  }

  return (
    <TagsStoreContext.Provider value={storeRef.current}>
      {children}
    </TagsStoreContext.Provider>
  );
};

export const useTagsStore = <T,>(selector: (state: TagsStore) => T): T => {
  const tagsStoreContext = useContext(TagsStoreContext);

  if (!tagsStoreContext) {
    throw new Error("useTagsStore must be used within a TagsStoreProvider");
  }

  return useStore(tagsStoreContext, selector);
};
