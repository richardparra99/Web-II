// services/EventsService.js
import apiCliente from "./apiCliente";

const getPublicEvents = () => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get("/events/public")
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                alert("Error al cargar eventos públicos");
                reject(error);
            });
    });
};

const getEventById = (id) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get(`/events/${id}`)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                alert("Error al cargar el evento");
                reject(error);
            });
    });
};

// SUBIR POSTER con multer (file)
const uploadEventPoster = (file) => {
    const formData = new FormData();
    formData.append("file", file); // el backend espera "file"

    return new Promise((resolve, reject) => {
        apiCliente
            .post("/events/poster", formData)
            .then((response) => resolve(response.data)) // { url: 'http://localhost:3000/uploads/...' }
            .catch((error) => {
                console.error(error);
                alert("Error al subir la imagen");
                reject(error);
            });
    });
};

// Crear evento
const createEvent = (eventData) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .post("/events", eventData)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message || "Error al crear el evento";
                alert(msg);
                reject(error);
            });
    });
};

// 🔹 NUEVO: actualizar evento
const updateEvent = (id, eventData) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .patch(`/events/${id}`, eventData)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message || "Error al actualizar el evento";
                alert(msg);
                reject(error);
            });
    });
};

export {
    getPublicEvents,
    getEventById,
    createEvent,
    uploadEventPoster,
    updateEvent,      // 👈 export nuevo
};
