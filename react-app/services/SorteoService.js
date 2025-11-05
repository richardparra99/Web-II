import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const API_URL = "http://localhost:3000/sorteos";

const getAllSorteos = () => {
    return new Promise((resolve, reject) => {
        const token = getAccessToken();
        if (!token) {
            console.warn("No hay token disponible, no se cargan los sorteos.");
            resolve([]); // Devuelve una lista vacía
            return;
        }
        axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                console.warn("Token inválido o expirado. Redirigir al login.");
                localStorage.removeItem("token");
            }
            reject(error);
        });
    });
};

const getSorteoById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.error("Error al obtener sorteo:", error);
            reject(error);
        });
    });
};

const crearSorteo = (sorteo) => {
    return new Promise((resolve, reject) => {
        axios.post(API_URL, sorteo, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            const nuevoSorteo = response.data;
            resolve(nuevoSorteo);
        })
        .catch((error) => {
            console.error("Error al crear sorteo:", error);
            reject(error);
        });
    });
};

const actualizarSorteo = (id, sorteo) => {
    return new Promise((resolve, reject) => {
        axios.put(`${API_URL}/${id}`, sorteo, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            const sorteoActualizado = response.data;
            resolve(sorteoActualizado);
        })
        .catch((error) => {
            console.error("Error al actualizar sorteo:", error);
            reject(error);
        });
    });
};

const eliminarSorteo = (id) => {
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
            console.error("Error al eliminar sorteo:", error);
            reject(error);
        });
    });
};

const sortearNombres = (id) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/${id}/sortear`, {}, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.error("Error al sortear nombres:", error);
            reject(error);
        });
    });
};

const getSorteoPorHash = (hash) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/hash/${hash}`)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error("Error al obtener sorteo por hash:", error);
                reject(error);
            });
    });
};

export {
    getAllSorteos,
    getSorteoById,
    crearSorteo,
    actualizarSorteo,
    eliminarSorteo,
    sortearNombres,
    getSorteoPorHash
};
