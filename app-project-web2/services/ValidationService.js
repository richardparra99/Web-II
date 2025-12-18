import apiCliente from "./apiCliente";

const validateQrToken = (token) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get(`/validation/${encodeURIComponent(token)}`)
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);

                const msg =
                    error?.response?.data?.message ||
                    "Error al validar el código QR";

                alert(msg);
                reject(error);
            });
    });
};

export { validateQrToken };
