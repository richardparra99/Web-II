import apiCliente from "./apiCliente";

const registerToEvent = (eventId) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .post("/registrations", { eventId })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al inscribirse en el evento";
                alert(msg);
                reject(error);
            });
    });
};

// GET /registrations/my
const getMyRegistrations = () => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get("/registrations/my")
            .then((response) => {
                resolve(response.data); // array de inscripciones
            })
            .catch((error) => {
                console.error(error);
                alert("Error al cargar tus inscripciones");
                reject(error);
            });
    });
};

// DELETE /registrations/:id
const cancelRegistration = (id) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .delete(`/registrations/${id}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al cancelar la inscripción";
                alert(msg);
                reject(error);
            });
    });
};

const getRegistrationsByEvent = (eventId) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get(`/registrations/by-event/${eventId}`)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al cargar inscripciones del evento";
                alert(msg);
                reject(error);
            });
    });
};

export { registerToEvent, getMyRegistrations, cancelRegistration, getRegistrationsByEvent };
