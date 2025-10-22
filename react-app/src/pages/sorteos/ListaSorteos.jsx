import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../../hooks/userAuthToken";
import { getAllSorteos, eliminarSorteo, sortearNombres } from "../../../services/SorteoService";
import moment from "moment";

const ListaSorteos = () => {
    useAuthentication(true);
    const [sorteos, setSorteos] = useState([]);

    useEffect(() => {
        const fetchSorteos = () => {
            getAllSorteos()
                .then((res) => setSorteos(res))
                .catch(() => alert("Error al obtener sorteos"));
        };
        fetchSorteos();
    }, []);

    // 🔹 Eliminar un sorteo
    const onClickEliminar = (id) => {
        if (!window.confirm("¿Eliminar este sorteo?")) return;
        eliminarSorteo(id)
            .then(() => {
                alert("Sorteo eliminado correctamente");
                setSorteos((prev) => prev.filter((s) => s.id !== id));
            })
            .catch(() => alert("Error al eliminar el sorteo"));
    };

    // 🔹 Sortear nombres
    const onClickSortear = (id) => {
        if (!window.confirm("¿Sortear los nombres? Esto no se puede revertir.")) return;
        sortearNombres(id)
            .then(() => {
                alert("Sorteo realizado correctamente");
                setSorteos((prev) =>
                    prev.map((s) =>
                        s.id === id ? { ...s, iniciado: true } : s
                    )
                );
            })
            .catch(() => alert("Error al realizar el sorteo"));
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <h2>Lista de sorteos</h2>
                            </Col>
                        </Row>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorteos.length > 0 ? (
                                    sorteos.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.nombre}</td>
                                            <td>{moment(s.fecha).format("DD/MM/YYYY")}</td>
                                            <td>{s.iniciado ? "Iniciado" : "Pendiente"}</td>
                                            <td>
                                                <Link
                                                    to={`/sorteos/${s.id}/edit`}
                                                    className="btn btn-info btn-sm me-2"
                                                >
                                                    Editar
                                                </Link>
                                                <Link
                                                    to={`/sorteos/${s.id}/participantes`}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    Participantes
                                                </Link>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => onClickSortear(s.id)}
                                                >
                                                    Sortear
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => onClickEliminar(s.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted py-3">
                                            No hay sorteos creados aún
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaSorteos;
