// src/services/UserService.js
import apiCliente from "./apiCliente";

// Listar todos los usuarios (solo admin en backend)
const getUsers = () => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get("/users")
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al cargar usuarios";
                alert(msg);
                reject(error);
            });
    });
};

// Cambiar roles de un usuario
const updateUserRoles = (userId, roles) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .patch(`/users/${userId}/roles`, { roles })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al actualizar roles";
                alert(msg);
                reject(error);
            });
    });
};

// Crear usuario desde admin
const createUser = ({ fullName, email, password, roles }) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .post("/users", { fullName, email, password, roles })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al crear usuario";
                alert(msg);
                reject(error);
            });
    });
};

// Editar datos de usuario (nombre, email, roles)
const updateUser = (userId, payload) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .patch(`/users/${userId}`, payload)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al actualizar usuario";
                alert(msg);
                reject(error);
            });
    });
};

// Cambiar contraseña de un usuario
const changeUserPassword = (userId, newPassword) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .patch(`/users/${userId}/password`, { newPassword })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al cambiar la contraseña";
                alert(msg);
                reject(error);
            });
    });
};

// Eliminar usuario
const deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .delete(`/users/${userId}`)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al eliminar usuario";
                alert(msg);
                reject(error);
            });
    });
};

export {
    getUsers,
    updateUserRoles,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
};
