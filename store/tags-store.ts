import { devtools } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

type Tag = {
  id: string
  name: string
  color: string
}

export type TagsState = {
  tags: Tag[],
  groupedTags: Record<string, Tag[]>
}

export type TagsActions = {
  addTags: (tags: Tag[]) => void
}

export type TagsStore = TagsState & TagsActions

export const defaultInitState: TagsState = {
  tags: [],
  groupedTags: {}
}

export const createTagStore = (
  initState: TagsState = defaultInitState
) => {
  return createStore<TagsStore>()(devtools((set) => ({
    ...initState,
    addTags: (tags: Tag[]) => set((state) => {
      state.groupedTags = {}
      tags.forEach((tag) => {
        if (!state.groupedTags[tag.color]) {
          state.groupedTags[tag.color] = []
        }
        state.groupedTags[tag.color].push(tag)
      })
      return {
        ...state,
        tags: [...tags],
        groupedTags: state.groupedTags
      }
    })
  })))
}
