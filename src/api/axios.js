import axios from "axios";

const api = axios.create({
    baseURL: "https://nfms-production.up.railway.app/api",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("STATUS :", error.response?.status);
        console.log("DATA :", error.response?.data);

        return Promise.reject(error);
    }
);

export default api;