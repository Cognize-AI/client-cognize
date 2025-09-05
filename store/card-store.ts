import { CardByIdData } from "@/types";
import { createStore } from "zustand";
import { devtools } from "zustand/middleware";

export type CardState = {
	selectedCardId: number | null;
	selectedCard: CardByIdData | null;
};

export type CardActions = {
	setSelectedCard: (card: CardByIdData) => void;
	setSelectedCardId: (cardId: number) => void;
};

export type CardStore = CardState & CardActions;

export const defaultInitState: CardStore = {
	selectedCardId: null,
	selectedCard: null,
	setSelectedCard: (card: CardByIdData) => {},
	setSelectedCardId: (cardId: number) => {},
};

export const createCardStore = (initState: CardStore = defaultInitState) => {
	return createStore<CardStore>()(
		devtools((set) => ({
			...initState,
			setSelectedCard: (card: CardByIdData) => set({ selectedCard: card }),
			setSelectedCardId: (cardId: number) => set({ selectedCardId: cardId }),
		})),
	);
};
