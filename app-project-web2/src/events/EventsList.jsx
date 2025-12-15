import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPublicEvents } from "../../services/EventsService";
import Header from "../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { API_BASE_URL } from "../../services/apiCliente";

// Helper para armar la URL
const getPosterSrc = (posterUrl) => {
    if (!posterUrl) return null;
    if (posterUrl.startsWith("http://") || posterUrl.startsWith("https://")) {
        return posterUrl;
    }
    return `${API_BASE_URL}${posterUrl}`;
};

const EventsList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOrganizer, isAdmin } = useAuthentication(); // solo para saber el rol

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await getPublicEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
            alert("Error al cargar eventos públicos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadEvents();
    }, []);

    return (
        <>
            <Header />
            <Container className="main-page">
                <div className="d-flex justify-content-between align-items-center">
                    <h1>Eventos próximos</h1>
                </div>

                {loading ? (
                    <div className="mt-3">
                        <Spinner animation="border" size="sm" /> Cargando...
                    </div>
                ) : events.length === 0 ? (
                    <p className="mt-3">No hay eventos próximos.</p>
                ) : (
                    <Row className="mt-3">
                        {events.map((ev) => {
                            const posterSrc = getPosterSrc(ev.posterUrl);

                            return (
                                <Col key={ev.id} md={4} className="mb-3">
                                    <Card className="h-100">
                                        {posterSrc && (
                                            <Card.Img
                                                variant="top"
                                                src={posterSrc}
                                                alt={ev.title}
                                                style={{
                                                    maxHeight: "180px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        )}
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{ev.title}</Card.Title>
                                            <Card.Text>
                                                {ev.description?.substring(0, 120)}
                                                ...
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Fecha:</strong>{" "}
                                                {new Date(
                                                    ev.startDate,
                                                ).toLocaleString()}
                                                <br />
                                                <strong>Ubicación:</strong>{" "}
                                                {ev.location}
                                            </Card.Text>

                                            <div className="mt-auto d-flex gap-2">
                                                <Link
                                                    to={`/events/${ev.id}`}
                                                    className="btn btn-dark btn-sm"
                                                >
                                                    Ver detalles
                                                </Link>

                                                {(isOrganizer || isAdmin) && (
                                                    <Link
                                                        to={`/events/${ev.id}/edit`}
                                                        className="btn btn-outline-warning btn-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default EventsList;
