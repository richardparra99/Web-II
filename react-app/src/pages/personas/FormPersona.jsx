import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import moment from "moment";

const FormPersona = () => {
    const navigate = useNavigate();
    const {id} = useParams(); //obtiene desde la url
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [edad, setEdad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [fecha, setFecha] = useState("");


    useEffect(() => {
        if(!id){
            return;
        }
        const fetchPersona = () => {
            axios.get(`http://localhost:3000/personas/${id}`)
            .then((response) => {
                const persona = response.data;
                setNombre(persona.nombre || "");
                setApellido(persona.apellido || "");
                setEdad(persona.edad || "");
                setCiudad(persona.ciudad || "");
                setFecha(moment(persona.fechaNacmiento).format("YYYY-MM-DD" || ""));
            })
            .catch((error) => {
                console.error(error);
                alert("Error al cargar a la persona");
                navigate("/");
            })
        }
        fetchPersona();
    }, [id])

    const onPersonaSaveClick = (e) => {
        const form = e.currentTarget;
        let hasErrors = false;
        e.preventDefault();
        e.stopPropagation();
        if(form.checkValidity() === false){
            hasErrors = true;
        }
        setValidated(true);
        
        if(hasErrors){
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
        if(ciudad){
            persona.ciudad = ciudad;
        }
        if(fecha){
            persona.fechaNacimiento = fecha;
        }
        if(id){
            sendPersonaActualizar(persona);
        } else {
            sendPersonaCreate(persona);
        }
    }

    const sendPersonaActualizar = (persona) => {
        axios.put(`http://localhost:3000/personas/${id}`, persona)
        .then((response) => {
            console.log(response.data);
            navigate("/");
        }).catch((error) => {
            console.error(error);
            alert("Error al guardar a la persona");
        });
    }

    const sendPersonaCreate = (persona) => {
        axios.post("http://localhost:3000/personas", persona).then((response) => {
            console.log(response.data);
            navigate("/");
        }).catch((error) => {
            console.error(error);
            alert("Error al guardar la persona");
        });
    }

    const onClickCancelar = () => {
        navigate("/");
    }

    return (
        <>
        <Header/>
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