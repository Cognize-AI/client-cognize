import { List } from "@/types"
import { createStore } from "zustand";
import { devtools } from "zustand/middleware";

export type ListState = {
  lists: List[]
}

export type ListActions = {
  addList: (list: List) => void;
  deleteList: (id: number) => void;
}

export type ListStore = ListState & ListActions

export const defaultInitState: ListStore = {
  lists: [],
  addList: (list: List) => {},
  deleteList: (id: number) => {}
}

export const createListStore = (
  initState: ListStore = defaultInitState
) => {
  return createStore<ListStore>()(devtools((set) => ({
    ...initState,
    addList: (list: List) => set((state) => ({
      lists: [...state.lists, list]
    })),
    deleteList: (id: number) => set((state) => ({
      lists: state.lists.filter((list) => list.id !== id)
    }))
  })))
}
