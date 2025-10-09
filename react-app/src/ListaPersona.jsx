import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import SearchTextField from "./components/SearchTextField";

const ListaPersona = () => {
    const [listaPersona, setListaPersona] = useState([]);
    const fetchPersona = () => {
        axios.get("http://localhost:3000/personas")
        .then((response) => {
            setListaPersona(response.data);
            console.log(response.data);
        });
    }

    useEffect(() => {
        fetchPersona();
    }, [])
    return (
        <Container>
            <Row>
                <Col>
                <Row>
                    <Col md={10}>
                        <h1>Listas de Personas</h1>
                    </Col>
                    <Col md={2}>
                        <SearchTextField className={"mt-2"}></SearchTextField>
                    </Col>
                </Row>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>edad</th>
                            <th>Ciudad</th>
                            <th>Fecha de Nacimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaPersona.map((Persona) =>(
                            <tr key={Persona.id}>
                            <td>{Persona.id}</td>
                            <td>{Persona.nombre}</td>
                            <td>{Persona.apellido}</td>
                            <td>{Persona.edad}</td>
                            <td>{Persona.ciudad}</td>
                            <td>{Persona.fechaNacimiento}</td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
                </Col>
            </Row>
        </Container>
     );
}
 
export default ListaPersona;