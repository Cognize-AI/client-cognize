'use client'

import { CardStore, createCardStore } from "@/store/card-store"
import { createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

export type CardStoreApi = ReturnType<typeof createCardStore>
export const CardStoreContext = createContext<CardStoreApi | undefined>(undefined)

export interface CardStoreProviderProps {
  children: React.ReactNode
}

export const CardStoreProvider = ({
  children
}: CardStoreProviderProps) => {
  const storeRef = useRef<CardStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createCardStore()
  }
  return (
    <CardStoreContext.Provider value={storeRef.current}>
      {children}
    </CardStoreContext.Provider>
  )
}

export const useListStore = <T,>(
  selector: (state: CardStore) => T,
): T => {
  const cardStoreContext = useContext(CardStoreContext)

  if (!cardStoreContext) {
    throw new Error("useListStore must be used within a ListStoreProvider")
  }

  return useStore(cardStoreContext, selector)
}