import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const API_URL = "http://localhost:3000";

const authHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Reviews de una película (si quieres pedirlas directo, aunque ya vienen en la película)
export const getReviewsByPelicula = (peliculaId) => {
    return axios
        .get(`${API_URL}/reviews/pelicula/${peliculaId}`)
        .then((res) => res.data);
};

// Mis reviews (últimas películas donde hice review)
export const getMyReviews = () => {
    return axios
        .get(`${API_URL}/reviews/mine`, {
            headers: authHeader(),
        })
        .then((res) => res.data);
};

// Crear review
export const crearReview = (reviewData) => {
    return axios
        .post(`${API_URL}/reviews`, reviewData, {
            headers: authHeader(),
        })
        .then((res) => res.data);
};

// Editar review
export const actualizarReview = (id, reviewData) => {
    return axios
        .patch(`${API_URL}/reviews/${id}`, reviewData, {
            headers: authHeader(),
        })
        .then((res) => res.data);
};

// Eliminar review
export const eliminarReview = (id) => {
    return axios
        .delete(`${API_URL}/reviews/${id}`, {
            headers: authHeader(),
        })
        .then((res) => res.data);
};
