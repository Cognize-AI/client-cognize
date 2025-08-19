import axios from 'axios';
// import { SLICE_NAMES } from '../../constants/enums';
// instance
const axios_instance = axios.create({
  baseURL: `http://localhost:8080`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// axios_instance.interceptors.request.use(
//   (config) => {
//     const token =
//       JSON.parse(localStorage.getItem(SLICE_NAMES.USER) || '')?.access_token ||
//       null;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

export { axios_instance };
