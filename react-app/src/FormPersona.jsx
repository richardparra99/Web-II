import { useState } from "react";
import FormLabel from "./components/formLabel";
import SearchTextField from "./components/SearchTextField";
import { Button, Card, CardBody, Col, Container, FormControl, Row } from "react-bootstrap";

const FormPrueba = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [edad, setEdad] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [fecha, setFecha] = useState("");
    return (
        <Container>
            <Row className="mt-2">
                <Col md={9}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <div>
                                        <FormLabel txtRelacionado="txtNombre" texto="Nombre:"/>
                                        <FormControl id="txtNombre" type="text" onChange={(e) => {
                                            setNombre(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormLabel txtRelacionado="txtApellido" texto="Apellido:"/>
                                        <FormControl id="txtApellido" type="text" onChange={(e) => {
                                            setApellido(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormLabel txtRelacionado="txtEdad" texto="Edad:"/>
                                        <FormControl id="txtEdad" type="text" onChange={(e) => {
                                            setEdad(e.target.value);
                                        }} />
                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        <FormLabel txtRelacionado="txtCiudad" texto="Ciudad:"/>
                                        <FormControl id="txtCiudad" type="text" onChange={(e) => {
                                            setCiudad(e.target.value);
                                        }} />
                                    </div>
                                    <div>
                                        <FormLabel txtRelacionado="txtFecha" texto="Fecha de nacimiento:"/>
                                        <FormControl id="txtFecha" type="date" onChange={(e) => {
                                            setFecha(e.target.value);
                                        }} />
                                    </div>
                                </Col>
                            </Row>
                                    <div className="mt-2">
                                        <Button variant="success">Guardar</Button>
                                        <Button variant="danger" className="ms-2">Cancelar</Button>
                                    </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
 
export default FormPrueba;