import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const API_URL = "http://localhost:3000/participantes";

// Obtener todos los participantes de un sorteo
const getParticipantesBySorteo = (idSorteo) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/sorteo/${idSorteo}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.error("Error al obtener participantes:", error);
            reject(error);
        });
    });
};

// Crear un participante
const crearParticipante = (participante) => {
    return new Promise((resolve, reject) => {
        axios.post(API_URL, participante, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            const nuevoParticipante = response.data;
            resolve(nuevoParticipante);
        })
        .catch((error) => {
            console.error("Error al crear participante:", error);
            reject(error);
        });
    });
};

// Eliminar participante
const eliminarParticipante = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then(() => {
            resolve();
        })
        .catch((error) => {
            console.error("Error al eliminar participante:", error);
            reject(error);
        });
    });
};

// Obtener participante por hash (acceso público)
const getParticipantePorHash = (hash) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${hash}`)
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.error("Error al obtener participante por hash:", error);
            reject(error);
        });
    });
};

// Actualizar wishlist de un participante (acceso público)
const actualizarWishlist = (hash, wishlist) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/${hash}/wishlist`, { wishlist })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.error("Error al actualizar wishlist:", error);
            reject(error);
        });
    });
};

export {
    getParticipantesBySorteo,
    crearParticipante,
    eliminarParticipante,
    getParticipantePorHash,
    actualizarWishlist
};
