import { useEffect, useState } from "react";
import { getTopPeliculas } from "../../../services/PeliculasService";
import Header from "../../components/Header";
import { Col, Container, Row, Spinner, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [peliculas, setPeliculas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTopPeliculas()
            .then((data) => {
                setPeliculas(data);
            })
            .catch(() => {
                alert("Error al cargar las películas");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Header />
            <Container className="mt-3">
                <h2>Top 20 películas</h2>

                {loading ? (
                    <div className="d-flex justify-content-center mt-4">
                        <Spinner animation="border" />
                    </div>
                ) : peliculas.length === 0 ? (
                    <p className="mt-4 text-muted">Todavía no hay películas cargadas.</p>
                ) : (
                    <Row className="mt-3" xs={1} md={3} lg={4}>
                        {peliculas.map((peli) => (
                            <Col key={peli.id} className="mb-3">
                                <Card>
                                    {peli.imagen && (
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:3000/uploads/${peli.imagen}`}
                                            alt={peli.titulo}
                                            style={{ height: "250px", objectFit: "cover" }}
                                        />
                                    )}

                                    <Card.Body>
                                        <Card.Title>{peli.titulo}</Card.Title>
                                        <Card.Text>Año: {peli.anio}</Card.Text>
                                        <Card.Text>
                                            Promedio:{" "}
                                            {peli.calificacionPromedio != null
                                                ? peli.calificacionPromedio.toFixed(1)
                                                : "0.0"}
                                        </Card.Text>

                                        <Link
                                            className="btn btn-primary btn-sm"
                                            to={`/peliculas/${peli.id}`}
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

export default HomePage;
