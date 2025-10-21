import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../../hooks/userAuthToken";
import { getAllSorteos, eliminarSorteo, sortearNombres } from "../../../services/SorteoService";
import moment from "moment";

const ListaSorteos = () => {
    const navigate = useNavigate();
    useAuthentication(true);
    const [sorteos, setSorteos] = useState([]);

    const fetchSorteos = () => {
        getAllSorteos()
            .then((sorteos) => setSorteos(sorteos))
            .catch(() => alert("Error al obtener sorteos"));
    };

    useEffect(() => {
        fetchSorteos();
    }, []);

    const onClickEliminar = (id) => () => {
        if (!window.confirm("¿Eliminar este sorteo?")) return;
        eliminarSorteo(id)
            .then(fetchSorteos)
            .catch(() => alert("Error al eliminar el sorteo"));
    };

    const onClickSortear = (id) => () => {
        if (!window.confirm("¿Sortear los nombres? Esto no se puede revertir.")) return;
        sortearNombres(id)
            .then(fetchSorteos)
            .catch(() => alert("Error al realizar el sorteo"));
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Row>
                            <Col><h1>Sorteos</h1></Col>
                        </Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorteos.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.nombre}</td>
                                        <td>{moment.utc(s.fecha).format("DD/MM/YYYY")}</td>
                                        <td>{s.iniciado ? "Iniciado" : "Pendiente"}</td>
                                        <td>
                                            <Link to={`/sorteos/${s.id}/edit`} className="btn btn-info btn-sm me-2">
                                                Editar
                                            </Link>
                                            <Link to={`/sorteos/${s.id}/participantes`} className="btn btn-primary btn-sm me-2">
                                                Participantes
                                            </Link>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={onClickSortear(s.id)}
                                            >
                                                Sortear
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={onClickEliminar(s.id)}
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

export default ListaSorteos;
