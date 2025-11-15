import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import Header from "../../components/Header";
import RequiredLabel from "../../components/RequiredLabel";
import { useNavigate, useParams } from "react-router-dom";
import useAuthentication from "../../../hooks/userAuthToken";
import { crearParticipante } from "../../../services/ParticipanteService";

const FormParticipante = () => {
    const navigate = useNavigate();
    useAuthentication(true);
    const { idSorteo } = useParams();

    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [wishlist, setWishlist] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);

        // Si el formulario no pasa las validaciones, no continúa
        if (!form.checkValidity()) return;

        const participante = {
            nombre: nombre.trim(),
            email: email.trim(),
            wishlist: wishlist.trim(),
            idSorteo: parseInt(idSorteo)
        };

        try {
            await crearParticipante(participante);
            navigate(`/sorteos/${idSorteo}/participantes`);
        } catch (error) {
            console.error("Error al crear participante:", error);
        }
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
                                <h2>Nuevo participante</h2>

                                <Form noValidate validated={validated} onSubmit={onSubmit}>
                                    {/* Nombre */}
                                    <Form.Group className="mb-3" controlId="txtNombre">
                                        <RequiredLabel>Nombre</RequiredLabel>
                                        <Form.Control
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            isInvalid={validated && !nombre.trim()}
                                        />
                                        <FormControl.Feedback type="invalid">El nombre es obligatorio</FormControl.Feedback>
                                    </Form.Group>

                                    {/* Email */}
                                    <Form.Group className="mb-3" controlId="txtEmail">
                                        <RequiredLabel>Email</RequiredLabel>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            isInvalid={
                                                validated &&
                                                (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                            }
                                        />
                                        <FormControl.Feedback type="invalid">El email es obligatorio</FormControl.Feedback>
                                    </Form.Group>

                                    {/* Wishlist */}
                                    <Form.Group className="mb-3" controlId="txtWishlist">
                                        <RequiredLabel>Wishlist</RequiredLabel>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={wishlist}
                                            onChange={(e) => setWishlist(e.target.value)}
                                            isInvalid={validated && !wishlist.trim()}
                                            placeholder="agrega tu regalo"
                                        />
                                        <FormControl.Feedback type="invalid">El wishlist es obligatorio</FormControl.Feedback>
                                    </Form.Group>

                                    <div className="mt-3">
                                        <Button variant="success" type="submit">
                                            Guardar
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="ms-2"
                                            onClick={onCancelar}
                                            type="button"
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
