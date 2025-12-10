import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../../hooks/useAuthentication";
import Header from "../components/Header";
import RequiredLabel from "../components/RequiredLabel";

const FormLogin = () => {
    const navigate = useNavigate();
    const { doLogin } = useAuthentication(false);
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        let hasErrors = false;
        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setValidated(true);
        if (hasErrors) return;

        doLogin({ email, password });
    };

    const onClickCancelar = () => navigate("/");

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={5}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onSubmit}>
                                    <Row>
                                        <Col>
                                            <h1>Iniciar sesión</h1>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtEmail">
                                                    Email
                                                </RequiredLabel>
                                                <FormControl
                                                    id="txtEmail"
                                                    required
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <FormControl.Feedback type="invalid">
                                                    El email es obligatorio
                                                </FormControl.Feedback>
                                            </FormGroup>

                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtPassword">
                                                    Password
                                                </RequiredLabel>
                                                <FormControl
                                                    id="txtPassword"
                                                    required
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <FormControl.Feedback type="invalid">
                                                    El password es obligatorio
                                                </FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="success" type="submit">
                                            Iniciar sesión
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="ms-2"
                                            onClick={onClickCancelar}
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

export default FormLogin;
