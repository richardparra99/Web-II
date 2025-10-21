import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
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
    }, [idSorteo]);

    const onClickEliminar = (id) => () => {
        if (!window.confirm("¿Eliminar este participante?")) return;
        eliminarParticipante(id)
            .then(fetchParticipantes)
            .catch(() => alert("Error al eliminar participante"));
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Row>
                            <Col><h1>Participantes del sorteo</h1></Col>
                        </Row>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Wishlist</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participantes.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.nombre}</td>
                                        <td>{p.email}</td>
                                        <td>{p.wishlist || "-"}</td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                className="me-2"
                                                onClick={() =>
                                                    navigate(`/sorteos/${idSorteo}/participantes/${p.id}/edit`)
                                                }
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={onClickEliminar(p.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaParticipantes;
