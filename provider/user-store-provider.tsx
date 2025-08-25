'use client'

import { createUserStore, UserStore } from "@/store/user-store"
import { createContext, useContext, useRef } from "react"
import { useStore } from "zustand"

export type UserStoreApi = ReturnType<typeof createUserStore>

export const UserStoreContext = createContext<UserStoreApi | undefined>(undefined)

export interface UserProviderProps {
  children: React.ReactNode
}

export const UserStoreProvider = ({
  children,
}: UserProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null)
    if (storeRef.current === null) {
      storeRef.current = createUserStore()
    }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  )
}

export const useUserStore = <T,>(
  selector: (state: UserStore) => T,
): T => {
  const userStoreContext = useContext(UserStoreContext)

  if (!userStoreContext) {
    throw new Error("useUserStore must be used within a UserStoreProvider")
  }

  return useStore(userStoreContext, selector)
}
