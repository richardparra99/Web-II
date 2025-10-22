import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../../hooks/userAuthToken";
import { getParticipantesBySorteo, eliminarParticipante } from "../../../services/ParticipanteService";

const ListaParticipantes = () => {
    const { idSorteo } = useParams();
    const navigate = useNavigate();
    useAuthentication(true);

    const [participantes, setParticipantes] = useState([]);

    const fetchParticipantes = () => {
        getParticipantesBySorteo(idSorteo)
            .then((res) => setParticipantes(res))
            .catch(() => alert("Error al obtener los participantes"));
    };

    useEffect(() => {
        fetchParticipantes();
        // eslint-disable-next-line
    }, [idSorteo]);

    const onClickEliminar = (id) => () => {
        if (!window.confirm("¿Eliminar este participante?")) return;
        eliminarParticipante(id)
            .then(fetchParticipantes)
            .catch(() => alert("Error al eliminar participante"));
    };

    // 🔹 Nuevo participante (va a /sorteos/:idSorteo/participantes/create)
    const onClickNuevo = () => {
        navigate(`/sorteos/${idSorteo}/participantes/create`);
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <h2>Participantes del sorteo</h2>
                            </Col>
                            <Col className="text-end">
                                <Button variant="success" onClick={onClickNuevo}>
                                    Nuevo Participante
                                </Button>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Wishlist</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participantes.length > 0 ? (
                                    participantes.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.nombre}</td>
                                            <td>{p.email}</td>
                                            <td>{p.wishlist || "—"}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={onClickEliminar(p.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted">
                                            No hay participantes registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        <div className="mt-3">
                            <Button variant="secondary" onClick={() => navigate("/")}>
                                ← Volver a sorteos
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaParticipantes;
