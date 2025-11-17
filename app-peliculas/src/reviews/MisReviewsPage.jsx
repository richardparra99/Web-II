import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import useAuthToken from "../../hooks/useAuthToken.js";
import {
    getMyReviews,
    actualizarReview,
    eliminarReview,
} from "../../services/ReviewsService.js";
import Header from "../components/Header.jsx";

const MisReviewsPage = () => {
    // Protegemos la ruta
    useAuthToken(true);

    const [reviews, setReviews] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editTexto, setEditTexto] = useState("");
    const [editPuntuacion, setEditPuntuacion] = useState(5);

    const cargarReviews = () => {
        getMyReviews()
            .then((data) => setReviews(data))
            .catch(() => alert("Error al cargar mis reviews"));
    };

    useEffect(() => {
        cargarReviews();
    }, []);

    const startEdit = (review) => {
        setEditingId(review.id);
        setEditTexto(review.texto);
        setEditPuntuacion(review.puntuacion);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTexto("");
        setEditPuntuacion(5);
    };

    const saveEdit = (id) => {
        const data = {
            texto: editTexto,
            puntuacion: Number(editPuntuacion),
        };

        actualizarReview(id, data)
            .then(() => {
                cancelEdit();
                cargarReviews();
            })
            .catch(() => alert("Error al actualizar review"));
    };

    const deleteReview = (id) => {
        if (!window.confirm("¿Eliminar esta reseña?")) return;
        eliminarReview(id)
            .then(() => cargarReviews())
            .catch(() => alert("Error al eliminar review"));
    };

    return (
        <>
            <Header />
            <Container className="mt-3">
                <h2>Mis reviews</h2>
                <Row className="mt-3">
                    <Col>
                        {reviews.length === 0 && <p>No has hecho reviews todavía.</p>}

                        {reviews.map((r) => (
                            <Card className="mb-2" key={r.id}>
                                <Card.Body>
                                    <Card.Title>{r.pelicula?.titulo}</Card.Title>
                                    <Card.Subtitle className="mb-1 text-muted">
                                        Año: {r.pelicula?.anio}, puntucion: {r.puntuacion}
                                    </Card.Subtitle>

                                    {editingId === r.id ? (
                                        <>
                                            <textarea
                                                className="form-control mb-2"
                                                rows={3}
                                                value={editTexto}
                                                onChange={(e) => setEditTexto(e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                min={1}
                                                max={5}
                                                className="form-control mb-2"
                                                value={editPuntuacion}
                                                onChange={(e) => setEditPuntuacion(e.target.value)}
                                            />
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => saveEdit(r.id)}
                                            >
                                                Guardar
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={cancelEdit}
                                            >
                                                Cancelar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Card.Text className="mb-2">{r.texto}</Card.Text>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => startEdit(r)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => deleteReview(r.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default MisReviewsPage;
