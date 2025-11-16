import axios from "axios";

const API_URL = "http://localhost:3000";

export const login = (loginData) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL}/auth/login`, loginData)
            .then((response) => {
                resolve(response.data); // { accessToken }
            })
            .catch((error) => {
                console.error(error);
                alert("Error al iniciar sesión");
                reject(error);
            });
    });
};

export const register = (registerData) => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${API_URL}/auth/register`, registerData)
            .then((response) => {
                resolve(response.data); // { id, email, fullname }
            })
            .catch((error) => {
                console.error(error);
                alert("Error al registrarse");
                reject(error);
            });
    });
};
