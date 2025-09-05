import { createStore } from "zustand";
import { devtools } from "zustand/middleware";

type User = {
	id: number;
	name: string;
	email: string;
	profilePicture: string;
};

type TokenUser = User & { token: string };

export type UserState = {
	user: User | null;
	token: string | null;
};

export type UserActions = {
	setUser: (user: User) => void;
	setToken: (token: string) => void;
	setUserToken: (user: TokenUser) => void;
	logoutUser: () => void;
};

export type UserStore = UserState & UserActions;

const getLocalStorage = <T>(key: string, fallback: T): T => {
	if (typeof window === "undefined") return fallback;
	const item = localStorage.getItem(key);
	return item ? (JSON.parse(item) as T) : fallback;
};

export const defaultInitState: UserState = {
	user: getLocalStorage<User | null>("user", null),
	token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
	return createStore<UserStore>()(
		devtools((set) => ({
			...initState,
			setUser: (user: User) => {
				localStorage.setItem("user", JSON.stringify(user));
				set({ user });
			},
			setToken: (token: string) => {
				localStorage.setItem("token", token);
				set({ token });
			},
			setUserToken: (user: TokenUser) => {
				localStorage.setItem("token", user.token);
				let localUser: User = {
					id: user.id,
					name: user.name,
					email: user.email,
					profilePicture: user.profilePicture,
				};
				localStorage.setItem("user", JSON.stringify(localUser));
				set({ user: localUser, token: user.token });
			},
			logoutUser: () => {
				localStorage.removeItem("user");
				localStorage.removeItem("token");
				set({ user: null, token: null });
			},
		})),
	);
};
