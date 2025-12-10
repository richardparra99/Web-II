import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import Header from "../components/Header";
import { getEventById } from "../../services/EventsService";
import { registerToEvent } from "../../services/RegistrationsService";
import { getAccessToken } from "../../utils/TokenUtilities";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const data = await getEventById(id);
            setEvent(data);
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
            // Si no está logueado, lo mando al login
            navigate("/login");
            return;
        }

        try {
            setRegistering(true);
            await registerToEvent(Number(id));
            alert("Inscripción registrada correctamente");
            // Después de inscribirse lo mandamos a Mis inscripciones
            navigate("/registrations/my");
        } catch (err) {
            // El servicio ya hace alert con el mensaje del backend
            console.error(err);
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="main-page">
                    <Spinner animation="border" size="sm" /> Cargando...
                </Container>
            </>
        );
    }

    if (!event) {
        return (
            <>
                <Header />
                <Container className="main-page">
                    <p>Evento no encontrado.</p>
                </Container>
            </>
        );
    }

    const isLogged = !!getAccessToken();

    return (
        <>
            <Header />
            <Container className="main-page">
                <Card>
                    {event.posterUrl && (
                        <Card.Img variant="top" src={event.posterUrl} alt={event.title} />
                    )}
                    <Card.Body>
                        <Card.Title>{event.title}</Card.Title>
                        <Card.Text>{event.description}</Card.Text>
                        <Card.Text>
                            <strong>Fecha:</strong>{" "}
                            {new Date(event.startDate).toLocaleString()}
                            <br />
                            <strong>Ubicación:</strong> {event.location}
                            <br />
                            {event.price && (
                                <>
                                    <strong>Precio:</strong> {event.price} Bs
                                    <br />
                                </>
                            )}
                        </Card.Text>

                        {isLogged ? (
                            <Button
                                variant="success"
                                onClick={onRegisterClick}
                                disabled={registering}
                            >
                                {registering ? "Inscribiendo..." : "Inscribirme"}
                            </Button>
                        ) : (
                            <p className="mt-2">
                                Debes iniciar sesión para inscribirte en este evento.
                            </p>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default EventDetails;
