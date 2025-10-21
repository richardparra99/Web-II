import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import { useNavigate, useParams } from "react-router-dom";
import useAuthentication from "../../../hooks/userAuthToken";
import { crearSorteo, actualizarSorteo, getAllSorteos } from "../../../services/SorteoService";
import moment from "moment";

const FormSorteo = () => {
    const navigate = useNavigate();
    useAuthentication(true);
    const { id } = useParams();

    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");

    useEffect(() => {
        if (!id) return;
        getAllSorteos()
            .then((sorteos) => {
                const found = sorteos.find((s) => s.id === parseInt(id));
                if (found) {
                    setNombre(found.nombre);
                    // 🔹 Usa moment.utc para evitar desfase al mostrar
                    setFecha(moment.utc(found.fecha).format("YYYY-MM-DD"));
                }
            })
            .catch(() => alert("Error al cargar el sorteo"));
    }, [id]);

    const onSubmit = (e) => {
        e.preventDefault();
        setValidated(true);
        if (!nombre || !fecha) return;

        const fechaUTC = new Date(fecha + "T00:00:00Z").toISOString();

        const data = { 
            nombre, 
            fecha: fechaUTC
        };

        if (id) {
            actualizarSorteo(id, data)
                .then(() => navigate("/"))
                .catch(() => alert("Error al actualizar sorteo"));
        } else {
            crearSorteo(data)
                .then(() => navigate("/"))
                .catch(() => alert("Error al crear sorteo"));
        }
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onSubmit}>
                                    <h2>{id ? "Editar sorteo" : "Nuevo sorteo"}</h2>
                                    <FormGroup>
                                        <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
                                        <FormControl
                                            id="txtNombre"
                                            type="text"
                                            required
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">El nombre es obligatorio</FormControl.Feedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <RequiredLabel htmlFor="txtFecha">Fecha</RequiredLabel>
                                        <FormControl
                                            id="txtFecha"
                                            type="date"
                                            required
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">La fecha es obligatorio</FormControl.Feedback>
                                    </FormGroup>
                                    <div className="mt-3">
                                        <Button variant="success" type="submit">
                                            Guardar
                                        </Button>
                                        <Button variant="secondary" className="ms-2" onClick={() => navigate("/")}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FormSorteo;
