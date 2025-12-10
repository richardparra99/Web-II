// src/events/EventsList.jsx
import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPublicEvents } from "../../services/EventsService";
import Header from "../components/Header";
import useAuthentication from "../../hooks/useAuthentication";

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

                    {(isOrganizer || isAdmin) && (
                        <Link
                            to="/events/create"
                            className="btn btn-success"
                        >
                            Crear evento
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="mt-3">
                        <Spinner animation="border" size="sm" /> Cargando...
                    </div>
                ) : events.length === 0 ? (
                    <p className="mt-3">No hay eventos próximos.</p>
                ) : (
                    <Row className="mt-3">
                        {events.map((ev) => (
                            <Col key={ev.id} md={4} className="mb-3">
                                <Card>
                                    {ev.posterUrl && (
                                        <Card.Img
                                            variant="top"
                                            src={ev.posterUrl}
                                            alt={ev.title}
                                        />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{ev.title}</Card.Title>
                                        <Card.Text>
                                            {ev.description?.substring(
                                                0,
                                                120,
                                            )}
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
                                        <Link
                                            to={`/events/${ev.id}`}
                                            className="btn btn-primary"
                                        >
                                            Ver detalles
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default EventsList;
