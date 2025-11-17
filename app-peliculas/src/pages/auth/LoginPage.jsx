import { useState } from "react";
import useAuthToken from "../../../hooks/useAuthToken";
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

const LoginPage = () => {
    const { doLogin } = useAuthToken(false);
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
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

        doLogin({ email, password });
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
                                    <h2>Iniciar sesión</h2>

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
                                        <RequiredLabel htmlFor="txtPassword">Password</RequiredLabel>
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
                                            Iniciar sesión
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

export default LoginPage;
