import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import { useNavigate, useParams } from "react-router-dom";
import useAuthentication from "../../../hooks/userAuthToken";
import { crearParticipante, getParticipantesBySorteo } from "../../../services/ParticipanteService";

const FormParticipante = () => {
    const navigate = useNavigate();
    useAuthentication(true);
    const { idSorteo } = useParams(); // viene de /sorteos/:idSorteo/participantes/create

    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [wishlist, setWishlist] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        setValidated(true);

        if (!nombre || !email) {
            alert("El nombre y el email son obligatorios");
            return;
        }

        const participante = {
            nombre,
            email,
            wishlist,
            idSorteo: parseInt(idSorteo)
        };

        crearParticipante(participante)
            .then(() => {
                alert("Participante creado correctamente");
                navigate(`/sorteos/${idSorteo}/participantes`);
            })
            .catch(() => alert("Error al crear participante"));
    };

    const onCancelar = () => {
        navigate(`/sorteos/${idSorteo}/participantes`);
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
                                    <h2>Nuevo participante</h2>
                                    <FormGroup className="mb-3">
                                        <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
                                        <FormControl
                                            id="txtNombre"
                                            type="text"
                                            required
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3">
                                        <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
                                        <FormControl
                                            id="txtEmail"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3">
                                        <RequiredLabel htmlFor="txtWishlist">Wishlist</RequiredLabel>
                                        <FormControl
                                            as="textarea"
                                            rows={3}
                                            id="txtWishlist"
                                            value={wishlist}
                                            placeholder="Ejemplo: Chocolates, libros, taza personalizada..."
                                            onChange={(e) => setWishlist(e.target.value)}
                                        />
                                    </FormGroup>

                                    <div className="mt-3">
                                        <Button variant="success" type="submit">
                                            Guardar
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="ms-2"
                                            onClick={onCancelar}
                                        >
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

export default FormParticipante;
