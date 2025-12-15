// src/registrations/MyRegistrations.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Modal,
    Row,
    Spinner,
} from "react-bootstrap";
import Header from "../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import {
    getMyRegistrations,
    cancelRegistration,
} from "../../services/RegistrationsService";
import {
    uploadPaymentReceipt,
    createPayment,
    getPaymentByRegistration,
} from "../../services/PaymentsService";
import { API_BASE_URL } from "../../services/apiCliente";
import QRCode from "react-qr-code";

// Helper para el póster
const getPosterSrc = (posterUrl) => {
    if (!posterUrl) return null;
    if (posterUrl.startsWith("http://") || posterUrl.startsWith("https://")) {
        return posterUrl;
    }
    return `${API_BASE_URL}${posterUrl}`;
};

// helper fecha
const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("es-BO", {
        dateStyle: "full",
        timeStyle: "short",
    });
};

const MyRegistrations = () => {
    // requiere login
    useAuthentication(true);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [registrations, setRegistrations] = useState([]);

    // modal “comprobante”
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedReg, setSelectedReg] = useState(null);

    // estado de pago
    const [payment, setPayment] = useState(null);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null);
    const [sendingReceipt, setSendingReceipt] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getMyRegistrations();
            setRegistrations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const openReceipt = async (reg) => {
        setSelectedReg(reg);
        setShowReceipt(true);
        setPayment(null);
        setReceiptFile(null);

        try {
            setLoadingPayment(true);
            const pay = await getPaymentByRegistration(reg.id); // puede ser null
            setPayment(pay);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPayment(false);
        }
    };

    const closeReceipt = () => {
        setShowReceipt(false);
        setSelectedReg(null);
        setPayment(null);
        setReceiptFile(null);
    };

    const onCancelClick = async (reg) => {
        if (
            !window.confirm(
                "¿Seguro que deseas cancelar esta inscripción? Esta acción no se puede deshacer.",
            )
        ) {
            return;
        }

        try {
            await cancelRegistration(reg.id);
            alert("Inscripción cancelada correctamente");
            await loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const onSendReceipt = async () => {
        if (!selectedReg) return;
        if (!receiptFile) {
            alert("Selecciona un archivo primero");
            return;
        }

        // opcional: evitar mandar comprobante si la inscripción está cancelada
        if (selectedReg.status === "CANCELLED") {
            alert("No puedes enviar comprobante de una inscripción cancelada.");
            return;
        }

        try {
            setSendingReceipt(true);

            // 1) subir archivo
            const { url } = await uploadPaymentReceipt(receiptFile);

            // 2) registrar / re-enviar pago
            const newPayment = await createPayment({
                registrationId: selectedReg.id,
                receiptUrl: url,
            });

            setPayment(newPayment);
            alert(`Comprobante enviado. Estado del pago: ${newPayment.status}`);
        } catch (err) {
            console.error(err);
        } finally {
            setSendingReceipt(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3 text-center">
                    <Spinner animation="border" role="status" />
                    <span className="ms-2">Cargando tus inscripciones...</span>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="main-page mt-3">
                <h1 className="mb-3">Mis inscripciones</h1>

                {registrations.length === 0 ? (
                    <p>Aún no estás inscrito en ningún evento.</p>
                ) : (
                    <Row className="gy-3">
                        {registrations.map((reg) => {
                            const ev = reg.event || reg.eventData || {};
                            const posterSrc = getPosterSrc(ev.posterUrl);
                            const status = reg.status || "PENDING";
                            const upperStatus = status.toUpperCase();
                            const isCancelled = upperStatus === "CANCELLED";
                            const isConfirmed = upperStatus === "CONFIRMED";

                            // valor que se codifica en el QR
                            const qrValue =
                                reg.qrToken ||
                                reg.qrPayload ||
                                `REG:${reg.id}|EV:${ev.id ?? ""}`;

                            let badgeText = "Activa";
                            let badgeVariant = "success";
                            if (isCancelled) {
                                badgeText = "Cancelada";
                                badgeVariant = "secondary";
                            } else if (isConfirmed) {
                                badgeText = "Confirmada";
                                badgeVariant = "primary";
                            } else {
                                // PENDING u otro
                                badgeText = "Pendiente";
                                badgeVariant = "warning";
                            }

                            // 👇 REGLA NUEVA: solo mostramos QR si la inscripción está CONFIRMED
                            const canShowQrOnCard = isConfirmed;

                            return (
                                <Col key={reg.id} md={6}>
                                    <Card className="h-100 shadow-sm">
                                        <Row className="g-0 h-100">
                                            {posterSrc && (
                                                <Col md={4}>
                                                    <Card.Img
                                                        src={posterSrc}
                                                        alt={ev.title}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            maxHeight: "200px",
                                                            objectFit: "cover",
                                                            borderTopLeftRadius:
                                                                "0.375rem",
                                                            borderBottomLeftRadius:
                                                                "0.375rem",
                                                        }}
                                                    />
                                                </Col>
                                            )}

                                            <Col
                                                md={posterSrc ? 8 : 12}
                                                className="d-flex"
                                            >
                                                <Card.Body className="d-flex flex-column w-100">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <Card.Title>
                                                                {ev.title}
                                                            </Card.Title>
                                                            <Card.Subtitle className="text-muted">
                                                                {formatDateTime(
                                                                    ev.startDate,
                                                                )}
                                                            </Card.Subtitle>
                                                        </div>
                                                        <Badge
                                                            bg={badgeVariant}
                                                        >
                                                            {badgeText}
                                                        </Badge>
                                                    </div>

                                                    <Card.Text className="mb-2">
                                                        <strong>Ubicación:</strong>{" "}
                                                        {ev.location}
                                                    </Card.Text>

                                                    {/* QR pequeño en la tarjeta (SOLO si está confirmado) */}
                                                    {canShowQrOnCard ? (
                                                        <div className="d-flex align-items-center gap-3 mb-3">
                                                            <div
                                                                style={{
                                                                    background:
                                                                        "white",
                                                                    padding: 4,
                                                                    borderRadius: 4,
                                                                }}
                                                            >
                                                                <QRCode
                                                                    value={
                                                                        qrValue
                                                                    }
                                                                    size={70}
                                                                />
                                                            </div>
                                                            <small className="text-muted">
                                                                Presenta este QR el
                                                                día del evento.
                                                            </small>
                                                        </div>
                                                    ) : (
                                                        <small className="text-muted mb-3">
                                                            Tu inscripción está
                                                            pendiente de aprobación
                                                            de pago. El QR se
                                                            habilitará cuando tu
                                                            pago sea aprobado.
                                                        </small>
                                                    )}

                                                    <div className="mt-auto d-flex flex-wrap gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/events/${ev.id}`,
                                                                )
                                                            }
                                                        >
                                                            Ver evento
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="outline-secondary"
                                                            onClick={() =>
                                                                openReceipt(reg)
                                                            }
                                                        >
                                                            Ver comprobante
                                                        </Button>

                                                        {!isCancelled && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-danger"
                                                                disabled={
                                                                    isConfirmed
                                                                }
                                                                onClick={() =>
                                                                    onCancelClick(
                                                                        reg,
                                                                    )
                                                                }
                                                            >
                                                                Cancelar
                                                                inscripción
                                                            </Button>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>

            {/* Modal de comprobante */}
            <Modal show={showReceipt} onHide={closeReceipt} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Comprobante de inscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReg && (
                        <Row className="align-items-center">
                            <Col md={8}>
                                <p>
                                    <strong>Inscripción #:</strong>{" "}
                                    {selectedReg.id}
                                </p>
                                {selectedReg.event && (
                                    <>
                                        <p>
                                            <strong>Evento:</strong>{" "}
                                            {selectedReg.event.title}
                                        </p>
                                        <p>
                                            <strong>Fecha:</strong>{" "}
                                            {formatDateTime(
                                                selectedReg.event.startDate,
                                            )}
                                        </p>
                                        <p>
                                            <strong>Ubicación:</strong>{" "}
                                            {selectedReg.event.location}
                                        </p>
                                    </>
                                )}
                                <p>
                                    <strong>Estado inscripción:</strong>{" "}
                                    {selectedReg.status || "PENDING"}
                                </p>

                                {/* Estado de pago */}
                                {loadingPayment ? (
                                    <p>
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                        />{" "}
                                        Cargando información de pago...
                                    </p>
                                ) : payment ? (
                                    <>
                                        <p>
                                            <strong>Estado de pago:</strong>{" "}
                                            {payment.status}
                                        </p>
                                        {payment.receiptUrl && (
                                            <p>
                                                <a
                                                    href={payment.receiptUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Ver comprobante enviado
                                                </a>
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-muted">
                                        Aún no has enviado comprobante de pago
                                        para esta inscripción.
                                    </p>
                                )}

                                {/* Subir / re-enviar comprobante */}
                                {(!payment ||
                                    payment.status === "REJECTED") && (
                                        <div className="mt-3">
                                            <p className="mb-1">
                                                Sube una foto o PDF del comprobante
                                                de depósito:
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) =>
                                                    setReceiptFile(
                                                        e.target.files?.[0] || null,
                                                    )
                                                }
                                            />
                                            <div className="mt-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={onSendReceipt}
                                                    disabled={sendingReceipt}
                                                >
                                                    {sendingReceipt
                                                        ? "Enviando..."
                                                        : "Enviar comprobante"}
                                                </Button>
                                            </div>
                                            {payment?.status === "REJECTED" && (
                                                <p className="text-danger mt-2">
                                                    Tu pago anterior fue rechazado.
                                                    Sube un nuevo comprobante.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                {payment &&
                                    payment.status === "PENDING" && (
                                        <p className="mt-3 text-muted">
                                            Tu pago está en revisión por el
                                            organizador. El QR se habilitará
                                            cuando sea aprobado.
                                        </p>
                                    )}

                                {payment &&
                                    payment.status === "APPROVED" && (
                                        <p className="mt-3 text-success">
                                            Tu pago fue aprobado. Ahora puedes
                                            usar tu código QR como entrada al
                                            evento.
                                        </p>
                                    )}
                            </Col>

                            {/* QR GRANDE SOLO SI EL PAGO ESTÁ APROBADO */}
                            <Col
                                md={4}
                                className="d-flex justify-content-center"
                            >
                                {payment && payment.status === "APPROVED" ? (
                                    <div
                                        style={{
                                            background: "white",
                                            padding: 8,
                                            borderRadius: 8,
                                        }}
                                    >
                                        <QRCode
                                            value={
                                                selectedReg.qrToken ||
                                                selectedReg.qrPayload ||
                                                `REG:${selectedReg.id}|EV:${selectedReg.event?.id ?? ""}`
                                            }
                                            size={140}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-muted text-center">
                                        El código QR se mostrará aquí cuando tu
                                        pago sea aprobado por el organizador.
                                    </p>
                                )}
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={() => window.print()}
                        disabled={!payment || payment.status !== "APPROVED"}
                    >
                        Imprimir
                    </Button>
                    <Button variant="primary" onClick={closeReceipt}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MyRegistrations;
