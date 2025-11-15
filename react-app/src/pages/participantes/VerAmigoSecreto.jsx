import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { getParticipantePorHash } from "../../../services/ParticipanteService";

const VerAmigoSecreto = () => {
    const { hash } = useParams();
    const [participante, setParticipante] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sorteoHash, participanteId] = hash.split("-");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getParticipantePorHash(sorteoHash);
                const encontrado = data.participantes?.find((p) => p.id === parseInt(participanteId));
                setParticipante(encontrado);
            } catch (error) {
                console.log(error);
                setError("El enlace no es válido o el sorteo no existe.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, [hash]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p>Cargando información del sorteo...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!participante) return null;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Tu Amigo Secreto</h2>
                            <p className="text-center text-muted mb-4">
                                Sorteo: <strong>{participante.sorteo}</strong>
                            </p>

                            <h5>Hola, {participante.nombre}</h5>
                            <p>Te ha tocado regalarle a:</p>

                            {participante.amigoSecreto ? (
                                <div className="p-3 border rounded bg-light mb-3">
                                    <p>
                                        <strong>{participante.amigoSecreto.nombre}</strong>
                                    </p>
                                    {participante.amigoSecreto.wishlist ? (
                                        <p>
                                            Desea: <em>{participante.amigoSecreto.wishlist}</em>
                                        </p>
                                    ) : (
                                        <p>Esta persona aún no escribió su wishlist.</p>
                                    )}
                                </div>
                            ) : (
                                <Alert variant="info">
                                    El sorteo aún no se ha realizado.
                                </Alert>
                            )}

                            <h6 className="mt-4">Tu wishlist</h6>
                            <p>
                                {participante.wishlistPropia
                                    ? participante.wishlistPropia
                                    : "No has añadido una wishlist."}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default VerAmigoSecreto;
