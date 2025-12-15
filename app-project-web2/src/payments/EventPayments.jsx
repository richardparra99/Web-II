// src/payments/EventPayments.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Badge,
    Button,
    Container,
    Row,
    Col,
    Table,
    Spinner,
} from "react-bootstrap";
import useAuthentication from "../../hooks/useAuthentication";
import { API_BASE_URL } from "../../services/apiCliente";
import Header from "../components/Header";
import { getPaymentByRegistration, reviewPayment } from "../../services/PaymentsService";
import { getRegistrationsByEvent } from "../../services/RegistrationsService";

const getPosterSrc = (posterUrl) => {
    if (!posterUrl) return null;
    if (posterUrl.startsWith("http://") || posterUrl.startsWith("https://")) {
        return posterUrl;
    }
    return `${API_BASE_URL}${posterUrl}`;
};

const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("es-BO", {
        dateStyle: "full",
        timeStyle: "short",
    });
};

const EventPayments = () => {
    const { id } = useParams(); // eventId
    const navigate = useNavigate();

    // requiere login; también usamos roles
    const { isOrganizer, isAdmin } = useAuthentication(true);

    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]); // { reg, payment }
    const [updatingId, setUpdatingId] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);

            // 1) inscripciones del evento
            const regs = await getRegistrationsByEvent(id);

            // 2) por cada inscripción, obtener último pago (puede ser null)
            const rowsTemp = await Promise.all(
                regs.map(async (reg) => {
                    let payment = null;
                    try {
                        payment = await getPaymentByRegistration(reg.id);
                    } catch (err) {
                        console.error(err);
                    }
                    return { reg, payment };
                }),
            );

            setRows(rowsTemp);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
        // eslint-disable-next-line
    }, [id]);

    // si llega a entrar alguien sin rol organizador/admin (por bug frontend),
    // mostramos mensaje; el backend igual protege.
    if (!isOrganizer && !isAdmin) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3">
                    <p>No tienes permisos para ver los pagos de este evento.</p>
                </Container>
            </>
        );
    }

    const handleReviewClick = async (payment, status) => {
        if (!payment) return;

        const texto =
            status === "APPROVED"
                ? "aprobar este pago y confirmar la inscripción"
                : "rechazar este pago y volver la inscripción a PENDING";

        if (
            !window.confirm(
                `¿Seguro que deseas ${texto}?\n\nPago #${payment.id}`,
            )
        ) {
            return;
        }

        try {
            setUpdatingId(payment.id);
            const updated = await reviewPayment(payment.id, status);

            // actualizar en memoria
            setRows((prev) =>
                prev.map((row) =>
                    row.payment && row.payment.id === payment.id
                        ? { ...row, payment: updated, reg: { ...row.reg, status: updated.registration?.status ?? row.reg.status } }
                        : row,
                ),
            );
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingId(null);
        }
    };

    const firstEvent = rows[0]?.reg?.event;
    const posterSrc = firstEvent ? getPosterSrc(firstEvent.posterUrl) : null;

    return (
        <>
            <Header />
            <Container className="main-page mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h1 className="mb-1">Pagos del evento</h1>
                        {firstEvent && (
                            <>
                                <h4>{firstEvent.title}</h4>
                                <p className="mb-0 text-muted">
                                    {formatDateTime(firstEvent.startDate)} —{" "}
                                    {firstEvent.location}
                                </p>
                            </>
                        )}
                    </div>
                    <div className="d-flex flex-column align-items-end">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/events/${id}`)}
                        >
                            Volver al evento
                        </Button>
                    </div>
                </div>

                {posterSrc && (
                    <Row className="mb-3">
                        <Col md={4}>
                            <img
                                src={posterSrc}
                                alt={firstEvent?.title}
                                style={{
                                    width: "100%",
                                    maxHeight: "220px",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                }}
                            />
                        </Col>
                    </Row>
                )}

                {loading ? (
                    <div className="mt-3">
                        <Spinner animation="border" size="sm" /> Cargando
                        inscripciones y pagos...
                    </div>
                ) : rows.length === 0 ? (
                    <p className="mt-3">
                        Aún no hay inscripciones para este evento.
                    </p>
                ) : (
                    <div className="table-responsive mt-3">
                        <Table hover bordered size="sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Participante</th>
                                    <th>Inscripción</th>
                                    <th>Pago</th>
                                    <th>Comprobante</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(({ reg, payment }, index) => {
                                    const participantName =
                                        reg.participant?.fullName ||
                                        reg.participant?.email ||
                                        "—";

                                    const regStatus =
                                        (reg.status || "PENDING").toUpperCase();

                                    const payStatus = payment
                                        ? payment.status
                                        : "SIN_COMPROBANTE";

                                    let regBadgeVariant = "secondary";
                                    if (regStatus === "CONFIRMED") {
                                        regBadgeVariant = "primary";
                                    } else if (regStatus === "PENDING") {
                                        regBadgeVariant = "warning";
                                    } else if (regStatus === "CANCELLED") {
                                        regBadgeVariant = "dark";
                                    }

                                    let payBadgeVariant = "secondary";
                                    if (payStatus === "PENDING") {
                                        payBadgeVariant = "warning";
                                    } else if (payStatus === "APPROVED") {
                                        payBadgeVariant = "success";
                                    } else if (payStatus === "REJECTED") {
                                        payBadgeVariant = "danger";
                                    }

                                    return (
                                        <tr key={reg.id}>
                                            <td>{index + 1}</td>
                                            <td>{participantName}</td>
                                            <td>
                                                <Badge bg={regBadgeVariant}>
                                                    {regStatus}
                                                </Badge>
                                                <br />
                                                <small className="text-muted">
                                                    Inscripción #{reg.id}
                                                </small>
                                            </td>
                                            <td>
                                                <Badge bg={payBadgeVariant}>
                                                    {payStatus}
                                                </Badge>
                                                {payment && (
                                                    <div>
                                                        <small className="text-muted">
                                                            Subido:{" "}
                                                            {formatDateTime(
                                                                payment.uploadedAt,
                                                            )}
                                                        </small>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {payment &&
                                                    payment.receiptUrl ? (
                                                    <a
                                                        href={
                                                            payment.receiptUrl
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Ver comprobante
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">
                                                        Sin comprobante
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {payment &&
                                                    payment.status ===
                                                    "PENDING" ? (
                                                    <div className="d-flex flex-column gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            disabled={
                                                                updatingId ===
                                                                payment.id
                                                            }
                                                            onClick={() =>
                                                                handleReviewClick(
                                                                    payment,
                                                                    "APPROVED",
                                                                )
                                                            }
                                                        >
                                                            {updatingId ===
                                                                payment.id
                                                                ? "Guardando..."
                                                                : "Aprobar"}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            disabled={
                                                                updatingId ===
                                                                payment.id
                                                            }
                                                            onClick={() =>
                                                                handleReviewClick(
                                                                    payment,
                                                                    "REJECTED",
                                                                )
                                                            }
                                                        >
                                                            Rechazar
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
        </>
    );
};

export default EventPayments;
