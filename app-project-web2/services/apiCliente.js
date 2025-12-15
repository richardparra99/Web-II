import axios from "axios";

import { getAccessToken } from "../utils/TokenUtilities";

const API_BASE_URL = "http://localhost:3000";
export { API_BASE_URL }; //exportamos la constante

const apiCliente = axios.create({
    baseURL: API_BASE_URL,
});

apiCliente.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token && token !== "undefined" && token !== "null") {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiCliente;
