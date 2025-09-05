import axios from "axios";

// I'm assuming this is the path to your slice name constants
// import { SLICE_NAMES } from '../../constants/enums';

const axios_instance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
	headers: {
		"Content-Type": "application/json",
	},
	// ❌ Remove `withCredentials: true` as it's for cookie-based auth
});

// ✅ Uncomment this interceptor to automatically add the auth token to requests
axios_instance.interceptors.request.use(
	(config) => {
		// Note: You need a more robust way to get the token, as this will run on the server too where localStorage doesn't exist.
		// A simple check for the window object fixes this.
		if (typeof window !== "undefined") {
			const token = localStorage.getItem("token"); // Get the token directly
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export { axios_instance };
