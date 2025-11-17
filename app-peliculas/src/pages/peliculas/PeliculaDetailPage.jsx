import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    FormControl,
    FormGroup,
    Row,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import Header from "../../components/Header.jsx";
import RequiredLabel from "../../components/RequiredLabel.jsx";
import useAuthToken from "../../../hooks/useAuthToken.js";
import { getPeliculaById } from "../../../services/PeliculasService.js";
import { getAccessToken } from "../../../utils/TokenUtilities.js";
import { crearReview } from "../../../services/ReviewsService.js";

const PeliculaDetailPage = () => {
    const { id } = useParams();
    const [pelicula, setPelicula] = useState(null);
    const [loading, setLoading] = useState(true);

    // formulario review
    const [texto, setTexto] = useState("");
    const [puntuacion, setPuntuacion] = useState(5);
    const [validated, setValidated] = useState(false);

    const token = getAccessToken();
    // No forzamos login aquí, solo mostramos el form si hay token
    useAuthToken(false);

    // cargar película
    useEffect(() => {
        if (!id) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoading(true);
        getPeliculaById(id)
            .then((data) => setPelicula(data))
            .catch(() => alert("Error al cargar la película"))
            .finally(() => setLoading(false));
    }, [id]);

    const recargarPelicula = () => {
        if (!id) return;
        getPeliculaById(id)
            .then((data) => setPelicula(data))
            .catch(() => alert("Error al recargar la película"));
    };

    const onSubmitReview = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);
        if (!form.checkValidity()) return;

        const data = {
            peliculaId: Number(id),
            texto,
            puntuacion: Number(puntuacion),
        };

        crearReview(data)
            .then(() => {
                setTexto("");
                setPuntuacion(5);
                setValidated(false);
                recargarPelicula(); // recargar para ver el nuevo promedio y reviews
            })
            .catch(() => {
                alert("Error al guardar la reseña");
            });
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="mt-3">
                    <p>Cargando...</p>
                </Container>
            </>
        );
    }

    if (!pelicula) {
        return (
            <>
                <Header />
                <Container className="mt-3">
                    <p>Película no encontrada</p>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="mt-3">
                <Row>
                    <Col md={4}>
                        <Card>
                            {pelicula.imagen && (
                                <Card.Img
                                    variant="top"
                                    src={`http://localhost:3000/uploads/${pelicula.imagen}`}
                                    alt={pelicula.titulo}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{pelicula.titulo}</Card.Title>
                                <Card.Text>Año: {pelicula.anio}</Card.Text>
                                <Card.Text>
                                    Promedio:{" "}
                                    {pelicula.calificacionPromedio != null
                                        ? pelicula.calificacionPromedio.toFixed(1)
                                        : "0.0"}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={8}>
                        <h3>Reviews</h3>

                        {pelicula.reviews && pelicula.reviews.length > 0 ? (
                            pelicula.reviews.map((r) => (
                                <Card className="mb-2" key={r.id}>
                                    <Card.Body>
                                        <Card.Subtitle className="mb-1 text-muted">
                                            {r.user?.fullname || "Usuario"}
                                        </Card.Subtitle>
                                        <Card.Text className="mb-1">{r.texto}</Card.Text>
                                        <Card.Text>puntuacion: {r.puntuacion}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>No hay reviews aún.</p>
                        )}

                        <hr />

                        <h4>Dejar un review</h4>
                        {token ? (
                            <Form noValidate validated={validated} onSubmit={onSubmitReview}>
                                <FormGroup className="mb-2">
                                    <RequiredLabel htmlFor="txtPuntuacion">
                                        Puntuación (1–5)
                                    </RequiredLabel>
                                    <FormControl
                                        id="txtPuntuacion"
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={puntuacion}
                                        onChange={(e) => setPuntuacion(e.target.value)}
                                        required
                                    />
                                    <FormControl.Feedback type="invalid">
                                        La puntuación debe ser entre 1 y 5
                                    </FormControl.Feedback>
                                </FormGroup>

                                <FormGroup className="mb-2">
                                    <RequiredLabel htmlFor="txtTexto">Reseña</RequiredLabel>
                                    <FormControl
                                        as="textarea"
                                        rows={3}
                                        id="txtTexto"
                                        value={texto}
                                        onChange={(e) => setTexto(e.target.value)}
                                        required
                                    />
                                    <FormControl.Feedback type="invalid">
                                        El texto de la reseña es obligatorio
                                    </FormControl.Feedback>
                                </FormGroup>

                                <Button variant="success" type="submit">
                                    Guardar reseña
                                </Button>
                            </Form>
                        ) : (
                            <p className="text-muted">
                                Debes iniciar sesión para dejar un review.
                            </p>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PeliculaDetailPage;
