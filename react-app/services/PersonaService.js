import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const getAllPersonas = () => {
    return new Promise((resolve, reject) => {
        axios.get("http://localhost:3000/personas", {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            console.error(error);
            reject(error);
        })
    });
}


const getPersonaById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:3000/personas/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then((response) => {
            const persona = response.data;
            resolve(persona);
        })
        .catch((error) => {
            console.error(error);
            reject(error);
        });
    });
}

const CrearPersona = (persona) => {
    return new Promise ((resolve, reject) => {
        axios.post("http://localhost:3000/personas", persona, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }).then((response) => {
            const nuevoPersona = response.data;
            resolve(nuevoPersona);
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    });
}


const actualizarPersona = (id, persona) => {
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3000/personas/${id}`, persona, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((response) => {
            const updatedPersona = response.data;
            resolve(updatedPersona);
        }).catch((error) => {
            console.error(error);
            reject(error);
        });
    })
}

const eliminarPersona = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3000/personas/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
        .then(() => {
            resolve();
        }).catch((error) => {
            console.error(error);
            alert("Error al eliminar persona");
            reject(error);
        });
    });
}

export { 
    getAllPersonas, 
    getPersonaById, 
    CrearPersona, 
    actualizarPersona,
    eliminarPersona
};