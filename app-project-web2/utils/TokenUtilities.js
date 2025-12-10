// src/utils/TokenUtilities.js
const saveAccessToken = (token) => {
    localStorage.setItem("token", token);
};

const getAccessToken = () => {
    return localStorage.getItem("token");
};

const removeAccessToken = () => {
    localStorage.removeItem("token");
};

// --- NUEVO: decodificar el payload del JWT ---
const decodeJwtPayload = (token) => {
    try {
        const [, payload] = token.split(".");
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.warn("No se pudo decodificar el token JWT", err);
        return null;
    }
};

const getDecodedToken = () => {
    const token = getAccessToken();
    if (!token) return null;
    return decodeJwtPayload(token);
};

export {
    saveAccessToken,
    getAccessToken,
    removeAccessToken,
    getDecodedToken,
};
