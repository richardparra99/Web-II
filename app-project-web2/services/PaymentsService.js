import apiCliente from "./apiCliente";

/**
 * 1) Subir archivo de comprobante
 */
const uploadPaymentReceipt = (file) => {
    const formData = new FormData();
    formData.append("file", file); // 👈 el backend espera el campo "file"

    return new Promise((resolve, reject) => {
        apiCliente
            .post("/payments/receipt", formData)
            .then((response) => resolve(response.data)) // { url }
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al subir el comprobante de pago";
                alert(msg);
                reject(error);
            });
    });
};

/**
 * 2) Registrar el pago con la URL del comprobante
 */
const createPayment = ({ registrationId, receiptUrl }) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .post("/payments", { registrationId, receiptUrl })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al registrar el pago";
                alert(msg);
                reject(error);
            });
    });
};

/**
 * 3) Obtener el último pago de una inscripción
 */
const getPaymentByRegistration = (registrationId) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .get(`/payments/by-registration/${registrationId}`)
            .then((response) => resolve(response.data))
            .catch((error) => {
                // Si el backend devuelve 404, lo tratamos como "no hay pago aún"
                if (error?.response?.status === 404) {
                    resolve(null);
                    return;
                }
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al cargar el estado de pago";
                alert(msg);
                reject(error);
            });
    });
};

/**
 * 4) Aprobar / Rechazar pago
 */
const reviewPayment = (paymentId, status) => {
    return new Promise((resolve, reject) => {
        apiCliente
            .patch(`/payments/${paymentId}`, { status })
            .then((response) => resolve(response.data))
            .catch((error) => {
                console.error(error);
                const msg =
                    error?.response?.data?.message ||
                    "Error al revisar el pago";
                alert(msg);
                reject(error);
            });
    });
};

export {
    uploadPaymentReceipt,
    createPayment,
    getPaymentByRegistration,
    reviewPayment,
};
