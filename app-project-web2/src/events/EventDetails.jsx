import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    Container,
    Spinner,
    Row,
    Col,
    Badge,
} from "react-bootstrap";
import Header from "../components/Header";
import { getEventById } from "../../services/EventsService";
import {
    registerToEvent,
    getMyRegistrations,
} from "../../services/RegistrationsService";
import { getAccessToken } from "../../utils/TokenUtilities";
import { API_BASE_URL } from "../../services/apiCliente";
import useAuthentication from "../../hooks/useAuthentication";

// Leaflet
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("es-BO", {
        dateStyle: "full",
        timeStyle: "short",
    });
};

const getPosterSrc = (posterUrl) => {
    if (!posterUrl) return null;
    if (posterUrl.startsWith("http://") || posterUrl.startsWith("https://")) {
        return posterUrl;
    }
    return `${API_BASE_URL}${posterUrl}`;
};

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);

    const { isOrganizer, isAdmin } = useAuthentication();

    const loadEvent = async () => {
        try {
            setLoading(true);
            const data = await getEventById(id);
            setEvent(data);

            const token = getAccessToken();
            if (token) {
                try {
                    const regs = await getMyRegistrations();
                    const currentId = Number(id);

                    const found = regs.find((r) => {
                        const evId =
                            r.event?.id ??
                            r.eventId ??
                            r.eventData?.id ??
                            null;
                        const status = (r.status || "").toUpperCase();
                        // Consideramos "ya inscrito" si NO está cancelada
                        return evId === currentId && status !== "CANCELLED";
                    });

                    setAlreadyRegistered(Boolean(found));
                } catch (err) {
                    console.error("Error al cargar inscripciones del usuario", err);
                    setAlreadyRegistered(false);
                }
            } else {
                setAlreadyRegistered(false);
            }
        } catch (err) {
            console.error(err);
            alert("Error al cargar el evento");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadEvent();
        // eslint-disable-next-line
    }, [id]);

    const onRegisterClick = async () => {
        const token = getAccessToken();
        if (!token) {
            navigate("/login");
            return;
        }

        // Si por alguna razón ya está marcado como inscrito, no repetimos
        if (alreadyRegistered) {
            alert("Ya estás inscrito en este evento.");
            return;
        }

        try {
            setRegistering(true);
            await registerToEvent(Number(id));
            alert("Inscripción registrada correctamente");
            setAlreadyRegistered(true); // ya no mostrar botón de inscribirse
            // opcional: podrías también redirigir
            // navigate("/registrations/my");
        } catch (err) {
            console.error(err);
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3 text-center">
                    <Spinner animation="border" role="status" />
                    <span className="ms-2">Cargando...</span>
                </Container>
            </>
        );
    }

    if (!event) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3">
                    <p>Evento no encontrado.</p>
                </Container>
            </>
        );
    }

    const isLogged = !!getAccessToken();
    const hasPoster = Boolean(event.posterUrl);
    const posterSrc = getPosterSrc(event.posterUrl);
    const precioTexto =
        event.price != null ? `${Number(event.price).toFixed(2)} Bs` : "Gratis";

    const canEdit = isOrganizer || isAdmin;

    const isPaidEvent =
        event.price != null && Number(event.price) > 0;

    const hasCoords =
        event.latitude != null &&
        event.latitude !== undefined &&
        event.longitude != null &&
        event.longitude !== undefined;

    return (
        <>
            <Header />
            <Container className="main-page mt-3">
                <h1 className="mb-3">{event.title}</h1>

                <Card className="shadow-sm">
                    <Row className="g-0">
                        {hasPoster && posterSrc && (
                            <Col md={4}>
                                <Card.Img
                                    src={posterSrc}
                                    alt={event.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        maxHeight: "320px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "0.375rem",
                                        borderBottomLeftRadius: "0.375rem",
                                    }}
                                />
                            </Col>
                        )}

                        <Col md={hasPoster && posterSrc ? 8 : 12}>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        {event.organizer?.fullName && (
                                            <Card.Subtitle className="text-muted">
                                                Organizado por{" "}
                                                {event.organizer.fullName}
                                            </Card.Subtitle>
                                        )}
                                    </div>
                                    <Badge bg="info" pill>
                                        {precioTexto}
                                    </Badge>
                                </div>

                                {event.description && (
                                    <Card.Text className="mb-3">
                                        {event.description}
                                    </Card.Text>
                                )}

                                <div className="mb-2">
                                    <strong>Fecha:</strong>{" "}
                                    {formatDateTime(event.startDate)}
                                </div>
                                <div className="mb-2">
                                    <strong>Ubicación:</strong> {event.location}
                                </div>
                                {event.capacity != null && (
                                    <div className="mb-3">
                                        <strong>Capacidad:</strong>{" "}
                                        {event.capacity} personas
                                    </div>
                                )}

                                {hasCoords && (
                                    <div className="mt-3">
                                        <h5 className="mb-2">Mapa del evento</h5>
                                        <div
                                            style={{
                                                height: "250px",
                                                width: "100%",
                                                borderRadius: "4px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <MapContainer
                                                center={[event.latitude, event.longitude]}
                                                zoom={15}
                                                scrollWheelZoom={false}
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; OpenStreetMap contributors'
                                                />
                                                <Marker
                                                    position={[
                                                        event.latitude,
                                                        event.longitude,
                                                    ]}
                                                />
                                            </MapContainer>
                                        </div>
                                    </div>
                                )}

                                {/* Botones */}
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    {isLogged ? (
                                        alreadyRegistered ? (
                                            <Button
                                                variant="outline-success"
                                                disabled
                                            >
                                                Ya estás inscrito en este evento
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="success"
                                                onClick={onRegisterClick}
                                                disabled={registering}
                                            >
                                                {registering
                                                    ? "Inscribiendo..."
                                                    : "Inscribirme"}
                                            </Button>
                                        )
                                    ) : (
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate("/login")}
                                        >
                                            Iniciar sesión para inscribirme
                                        </Button>
                                    )}

                                    <Button
                                        variant="dark"
                                        onClick={() => navigate("/")}
                                    >
                                        Volver a eventos
                                    </Button>

                                    {canEdit && (
                                        <Button
                                            variant="outline-warning"
                                            onClick={() =>
                                                navigate(`/events/${event.id}/edit`)
                                            }
                                        >
                                            Editar evento
                                        </Button>
                                    )}

                                    {canEdit && isPaidEvent && (
                                        <Button
                                            variant="outline-info"
                                            onClick={() =>
                                                navigate(
                                                    `/organizer/events/${event.id}/payments`,
                                                )
                                            }
                                        >
                                            Ver pagos del evento
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </>
    );
};

export default EventDetails;
