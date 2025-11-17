import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/AuthService";
import Header from "../../components/Header";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    FormControl,
    FormGroup,
    Row,
} from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");

    const onFormSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        let hasErrors = false;

        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setValidated(true);

        if (hasErrors) return;

        const data = { email, password, fullname };

        register(data)
            .then(() => {
                alert("Usuario registrado, ahora puedes iniciar sesión.");
                navigate("/auth/login"); // o "/login" si cambias tus rutas
            })
            .catch((error) => {
                console.error(error);
                alert("Error al registrarse");
            });
    };

    return (
        <>
            <Header />
            <Container className="mt-3">
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <h2>Registrarse</h2>

                                    <FormGroup className="mt-2">
                                        <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
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

                                    <FormGroup className="mt-2">
                                        <RequiredLabel htmlFor="txtFullname">
                                            Nombre completo
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtFullname"
                                            required
                                            type="text"
                                            value={fullname}
                                            onChange={(e) => setFullname(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            El nombre completo es obligatorio
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mt-2">
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

                                    <div className="mt-3">
                                        <Button variant="success" type="submit">
                                            Registrarse
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

export default RegisterPage;
