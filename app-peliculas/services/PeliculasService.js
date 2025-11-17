import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const API_URL = "http://localhost:3000";

const authHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// TOP 20 para la página principal (público)
export const getTopPeliculas = () => {
    return axios
        .get(`${API_URL}/peliculas/top`)
        .then((res) => res.data);
};

// Listado completo (si quieres usarlo, también es público)
export const getAllPeliculas = () => {
    return axios
        .get(`${API_URL}/peliculas`)
        .then((res) => res.data);
};

// Detalle de película con reviews + usuario (lo hicimos en backend)
export const getPeliculaById = (id) => {
    return axios
        .get(`${API_URL}/peliculas/${id}`)
        .then((res) => res.data);
};

// Crear película (solo si vas a usarlo en frontend, con auth + imagen después)
export const crearPelicula = (formData) => {
    return axios
        .post(`${API_URL}/peliculas`, formData, {
            headers: {
                ...authHeader(),
            },
        })
        .then((res) => res.data);
};
