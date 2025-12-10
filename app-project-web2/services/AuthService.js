// services/AuthService.js
import apiCliente from "./apiCliente";

const login = (loginData) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .post("/auth/login", loginData)
            .then((response) => {
                const data = response.data;

                // Soportar los 3 nombres típicos:
                // { accessToken }, { access_token } o { token }
                const accessToken =
                    data.accessToken ?? data.access_token ?? data.token;

                if (!accessToken) {
                    console.error("Respuesta de login SIN accessToken:", data);
                    alert("Respuesta de login inválida (no se recibió token)");
                    reject(new Error("missing accessToken"));
                    return;
                }

                // 👀 Aquí NO decodificamos nada, solo devolvemos el token
                resolve({ accessToken });
            })
            .catch((error) => {
                console.error(error);
                alert("Error al iniciar sesión");
                reject(error);
            });
    });
};

const register = (registerData) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .post("/auth/register", registerData)
            .then((response) => {
                resolve(response.data); // { id, email, fullName }
            })
            .catch((error) => {
                console.error(error);
                alert("Error al registrarse");
                reject(error);
            });
    });
};

export { login, register };
