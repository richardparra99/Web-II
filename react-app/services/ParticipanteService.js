import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const API_URL = "http://localhost:3000/participantes";

// ✅ Obtener todos los participantes de un sorteo
const getParticipantesBySorteo = async (idSorteo) => {
    try {
        const res = await axios.get(`${API_URL}/sorteo/${idSorteo}`, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
        return res.data;
    } catch (error) {
        console.error("Error al obtener participantes:", error.response?.data || error);
        throw error;
    }
};

// ✅ Crear un participante
const crearParticipante = async (participante) => {
    try {
        const res = await axios.post(API_URL, participante, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error al crear participante:", error.response?.data || error);
        throw error;
    }
};

// ✅ Eliminar participante
const eliminarParticipante = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
        });
    } catch (error) {
        console.error("Error al eliminar participante:", error.response?.data || error);
        throw error;
    }
};

// ✅ Obtener participante por hash (acceso público)
const getParticipantePorHash = async (hash) => {
    try {
        const res = await axios.get(`${API_URL}/${hash}`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener participante por hash:", error.response?.data || error);
        throw error;
    }
};

// ✅ Actualizar wishlist de un participante
const actualizarWishlist = async (hash, wishlist) => {
    try {
        const res = await axios.patch(`${API_URL}/${hash}/wishlist`, { wishlist });
        return res.data;
    } catch (error) {
        console.error("Error al actualizar wishlist:", error.response?.data || error);
        throw error;
    }
};

const seleccionarParticipante = async (idParticipante) => {
    try {
        const res = await axios.post(`${API_URL}/seleccionar`, { idParticipante });
        return res.data;
    } catch (error) {
        console.error("Error al seleccionar participante:", error.response?.data || error);
        throw error;
    }
};



export {
    getParticipantesBySorteo,
    crearParticipante,
    eliminarParticipante,
    getParticipantePorHash,
    actualizarWishlist,
    seleccionarParticipante
};
