import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Modal, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../../hooks/userAuthToken";
import { getAllSorteos, eliminarSorteo, sortearNombres } from "../../../services/SorteoService";
import moment from "moment";

const ListaSorteos = () => {
    const navigate = useNavigate();
    useAuthentication(true);

    const [sorteos, setSorteos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [linkPublico, setLinkPublico] = useState("");

    useEffect(() => {
        getAllSorteos()
            .then((res) => setSorteos(res))
            .catch(() => alert("Error al obtener sorteos"));
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
            .then((res) => {
                alert("🎉 Sorteo realizado correctamente");
                setSorteos((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, iniciado: true } : s))
                );
                const base = window.location.origin;
                setLinkPublico(`${base}${res.linkAcceso}`);
                setShowModal(true);
            })
            .catch(() => alert("Error al realizar el sorteo"));
    };

    // 🔹 Validar edición
    const onClickEditar = (sorteo) => {
        if (sorteo.iniciado) {
            alert("No se puede editar un sorteo que ya fue iniciado.");
            return;
        }
        navigate(`/sorteos/${sorteo.id}/edit`);
    };

    // 🔹 Abrir modal de compartir (sin volver a sortear)
    const onClickCompartir = (sorteo) => {
        if (!sorteo.iniciado) {
            alert("Aún no puedes compartir este sorteo porque no ha sido iniciado.");
            return;
        }
        const base = window.location.origin;
        setLinkPublico(`${base}/sorteo/${sorteo.hashAcceso}`);
        setShowModal(true);
    };

    // 🔹 Copiar link
    const copiarLink = () => {
        navigator.clipboard.writeText(linkPublico);
        alert("Enlace copiado al portapapeles");
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
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => onClickEditar(s)}
                                                >
                                                    Editar
                                                </Button>
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
                                                    disabled={s.iniciado}
                                                >
                                                    Sortear
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => onClickEliminar(s.id)}
                                                    disabled={s.iniciado}
                                                >
                                                    Eliminar
                                                </Button>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => onClickCompartir(s)}
                                                    disabled={!s.iniciado}
                                                >
                                                    Compartir
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

            {/* ✅ Modal de compartir */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Compartir enlace del sorteo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Envía este enlace a los participantes para que vean a quién les tocó:</p>
                    <FormControl
                        type="text"
                        value={linkPublico}
                        readOnly
                        onClick={(e) => e.target.select()}
                        className="mb-3"
                    />
                    <Button variant="outline-success" onClick={copiarLink}>
                        Copiar enlace
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ListaSorteos;
