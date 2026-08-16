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

        console.log("========== INTERCEPTOR ==========");
        console.log("Token :", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log("Authorization :", config.headers.Authorization);

        if (config.headers.toJSON) {
            console.log("Headers JSON :", config.headers.toJSON());
        } else {
            console.log("Headers :", config.headers);
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