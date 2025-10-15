import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import SearchTextField from "../../components/SearchTextField";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAuthentication from "../../../hooks/userAuthToken";
import { eliminarPersona, getAllPersonas } from "../../../services/PersonaService";

const ListaPersona = () => {
    const navegate = useNavigate();
    useAuthentication(true);
    const [listaPersona, setListaPersona] = useState([]);
    const [personasFiltradas, setPersonasFiltradas] = useState([]);
    const fetchPersona = () => {
        getAllPersonas().then((personas) => {
            setListaPersona(personas);
            setPersonasFiltradas(personas);
        }).catch(() => {
            alert("Error al cargar las personas")
        });
    }

    useEffect(() => {
        fetchPersona();
    }, [])

    const onClickEditar = (id) => () => {
        navegate(`/personas/${id}/edit`);
    }


    const onClickEliminar = (id) => () => {
        if (!window.confirm("Estas seguro de eliminar la persona")) {
            return;
        }
        eliminarPersona(id).then(() => {
            fetchPersona();
        }).catch(() => {
            alert("Error al eliminar a la persona");
        })
    }

    const onSearchChanged = (event) => {
        const text = event.target.value.toLowerCase();
        if(text === ""){
            setPersonasFiltradas(listaPersona);
            return;
        }
        const nuevaFiltro = listaPersona.filter((Persona) => {
            return Persona.nombre.toLowerCase().includes(text)
            || Persona.apellido.toLowerCase().includes(text)
            || Persona.edad.toString().includes(text)
            || Persona.ciudad?.toLowerCase().includes(text);
        });
        setPersonasFiltradas(nuevaFiltro);
    }

    return (
        <>
        <Header/>
            <Container>
                <Row>
                    <Col>
                    <Row>
                        <Col md={10}>
                            <h1>Listas de Personas</h1>
                        </Col>
                        <Col md={2}>
                            <SearchTextField className={"mt-2"} onTextChanged={onSearchChanged} />
                        </Col>
                    </Row>
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>edad</th>
                                <th>Ciudad</th>
                                <th>Fecha de Nacimiento</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {personasFiltradas.map((Persona) =>(
                                <tr key={Persona.id}>
                                <td>{Persona.id}</td>
                                <td>{Persona.nombre}</td>
                                <td>{Persona.apellido}</td>
                                <td>{Persona.edad}</td>
                                <td>{Persona.ciudad}</td>
                                <td>{Persona.fechaNacimiento && moment(Persona.fechaNacimiento).format("DD/MM/YYYY")}</td>
                                <td>
                                    <Button variant="info" onClick={onClickEditar(Persona.id)}>Editar</Button>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={onClickEliminar(Persona.id)}>Eliminar</Button>
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
}
 
export default ListaPersona;