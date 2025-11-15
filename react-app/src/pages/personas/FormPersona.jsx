import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import moment from "moment";
import useAuthentication from "../../../hooks/userAuthToken";
import { actualizarPersona, CrearPersona, getPersonaById } from "../../../services/PersonaService";

const FormPersona = () => {
    const navigate = useNavigate();
    useAuthentication(true);
    const { id } = useParams(); //obtiene desde la url
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [edad, setEdad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [fecha, setFecha] = useState("");

    useEffect(() => {
        if (!id) {
            return;
        }
        const fetchPersona = () => {
            getPersonaById(id).then((response) => {
                const persona = response.data;
                setNombre(persona.nombre || "");
                setApellido(persona.apellido || "");
                setEdad(persona.edad || "");
                setCiudad(persona.ciudad || "");
                // eslint-disable-next-line
                setFecha(moment(persona.fechaNacmiento).format("YYYY-MM-DD" || ""));
            })
                .catch((error) => {
                    console.log(error);
                    alert("Error al cargar a la persona");
                    navigate("/");
                });
        }
        fetchPersona();
        // eslint-disable-next-line
    }, [id])

    const onPersonaSaveClick = (e) => {
        const form = e.currentTarget;
        let hasErrors = false;
        e.preventDefault();
        e.stopPropagation();
        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setValidated(true);

        if (hasErrors) {
            return;
        }
        sendPersonaForm();
    }

    const sendPersonaForm = () => {
        const persona = {
            nombre,
            apellido,
            edad
        }
        if (ciudad) {
            persona.ciudad = ciudad;
        }
        if (fecha) {
            persona.fechaNacimiento = fecha;
        }
        if (id) {
            sendPersonaActualizar(persona);
        } else {
            sendPersonaCreate(persona);
        }
    }

    const sendPersonaActualizar = (persona) => {
        actualizarPersona(id, persona).then((personaUpdate) => {
            console.log(personaUpdate);
            navigate("/");
        }).catch(() => {
            alert("Error al actualizar persona");
        })
    }

    const sendPersonaCreate = (persona) => {
        CrearPersona(persona).then((nuevaPersona) => {
            console.log(nuevaPersona);
            navigate("/");
        }).catch(() => {
            alert("Error al crear a la persona");
        });
    }

    const onClickCancelar = () => {
        navigate("/");
    }

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={9}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onPersonaSaveClick}>
                                    <Row>
                                        <Col>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
                                                <FormControl id="txtNombre" required type="text" value={nombre} onChange={(e) => {
                                                    setNombre(e.target.value);
                                                }} />
                                                <FormControl.Feedback type="invalid">El nombre es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtApellido">Apellido</RequiredLabel>
                                                <FormControl id="txtApellido" required type="text" value={apellido} onChange={(e) => {
                                                    setApellido(e.target.value);
                                                }} />
                                                <FormControl.Feedback type="invalid">El apellido es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtEdad">Edad</RequiredLabel>
                                                <FormControl id="txtEdad" required type="number" value={edad} onChange={(e) => {
                                                    setEdad(e.target.value);
                                                }} />
                                                <FormControl.Feedback type="invalid">La edad es obligatorio</FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                        <Col>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtCiudad">Ciudad</RequiredLabel>
                                                <FormControl id="txtCiudad" type="text" value={ciudad} onChange={(e) => {
                                                    setCiudad(e.target.value);
                                                }} />
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtFecha">Fecha de Nacimiento</RequiredLabel>
                                                <FormControl id="txtFecha" type="date" value={fecha} onChange={(e) => {
                                                    setFecha(e.target.value);
                                                }} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="success" type="submit">Guardar</Button>
                                        <Button variant="danger" className="ms-2" onClick={onClickCancelar}>Cancelar</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FormPersona;