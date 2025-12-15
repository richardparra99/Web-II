// services/PaymentsService.js
import apiCliente from "./apiCliente";

/**
 * 1) Subir archivo de comprobante (imagen/PDF/etc.)
 *    POST /payments/receipt
 *    Body: form-data con campo "file"
 *    Respuesta: { url: "http://localhost:3000/uploads/receipts/xxx.png" }
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
 *    POST /payments
 *    Body: { registrationId, receiptUrl }
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
 *    GET /payments/by-registration/:registrationId
 *    Respuesta: PaymentEntity o null
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
 *    PATCH /payments/:id
 *    Body: { status: "APPROVED" | "REJECTED" }
 *    Solo ORGANIZER o ADMIN (backend ya valida)
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
