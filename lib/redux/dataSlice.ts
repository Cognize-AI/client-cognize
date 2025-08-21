import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CardType, ListType } from '@/app/kanban/page'

type User = {
  id: number
  name: string
  email: string
  profilePicture: string
}

interface DataState {
  user: User | null
  lists: ListType[]
}

const initialState: DataState = {
  user: null,
  lists: [],
}

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setLists: (state, action: PayloadAction<ListType[]>) => {
      state.lists = action.payload
    },
    addCardToList: (state, action: PayloadAction<CardType>) => {
      const list = state.lists.find((l) => l.id === action.payload.list_id)
      if (list) {
        if (!list.cards) {
          list.cards = []
        }
        list.cards.push(action.payload)
      }
    },
    clearAllData: (state) => {
      state.user = null
      state.lists = []
    },
  },
})

export const { setUser, setLists, addCardToList, clearAllData } = dataSlice.actions

export default dataSlice.reducer