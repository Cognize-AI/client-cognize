import { Key } from "@/types";
import { createStore } from "zustand";
import { devtools } from "zustand/middleware";

export type APIState = {
  apiKey: Key | null;
};

export type APIActions = {
  setApiKey: (apiKey: Key) => void;
};

export type APIStore = APIState & APIActions;

export const defaultInitState: APIStore = {
  apiKey: null,
  setApiKey: (apiKey: Key) => {},
};

export const createApiStore = (initState: APIStore = defaultInitState) => {
  return createStore<APIStore>()(
    devtools((set) => ({
      ...initState,
      setApiKey: (apiKey: Key) => set({ apiKey }),
    })),
  );
};
