import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

const defaultColors = ["#F8BBD0", "#B2EBF2", "#FFF9C4", "#BBDEFB", "#FFE0B2"];

type Tag = {
	id: number;
	name: string;
	color: string;
};

export type TagsState = {
	tags: Tag[];
	groupedTags: Record<string, Tag[]>;
};

export type TagsActions = {
	addTags: (tags: Tag[]) => void;
};

export type TagsStore = TagsState & TagsActions;

// const defaultGroupedTags = {
//   "#A78BFA": [],
//   "#FCA5A5": [],
//   "#34D399": [],
//   "#60A5FA": [],
//   "#FBBF24": []
// }

export const defaultInitState: TagsState = {
	tags: [],
	groupedTags: {
		"#A78BFA": [],
		"#FCA5A5": [],
		"#34D399": [],
		"#60A5FA": [],
		"#FBBF24": [],
	},
};

export const createTagStore = (initState: TagsState = defaultInitState) => {
	return createStore<TagsStore>()(
		devtools((set) => ({
			...initState,
			addTags: (tags: Tag[]) =>
				set((state) => {
					state.groupedTags = {
						"#A78BFA": [],
						"#FCA5A5": [],
						"#34D399": [],
						"#60A5FA": [],
						"#FBBF24": [],
					};
					tags.forEach((tag) => {
						if (!state.groupedTags[tag.color]) {
							state.groupedTags[tag.color] = [];
						}
						state.groupedTags[tag.color].push(tag);
					});
					return {
						...state,
						tags: [...tags],
						groupedTags: state.groupedTags,
					};
				}),
		})),
	);
};
