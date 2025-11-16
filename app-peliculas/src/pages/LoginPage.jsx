import { useState } from "react";
import useAuthToken from "../../hooks/useAuthToken";
import Header from "../components/Header";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../components/RequiredLabel";

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
        if (form.checkValidaty() === false) {
            hasErrors = true;
        }
        setValidated(true);
        if (hasErrors) {
            return;
        }

        doLogin({ email, password });
    }

    return (
        <>
            <Header>
                <Container>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                        <h2>Iniciar sesion</h2>
                                        <FormGroup className="mt-2">
                                            <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
                                            <FormControl
                                                id="txtEmail"
                                                required
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <FormControl.Feedback>
                                                El email es obligatorio
                                            </FormControl.Feedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <RequiredLabel htmlFor="txtPassword">Password</RequiredLabel>
                                            <FormControl
                                                id="txtPassword"
                                                required
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <FormControl.Feedback>
                                                El password es obligatorio
                                            </FormControl.Feedback>
                                        </FormGroup>
                                        <div>
                                            <Button variant="success" type="submit">
                                                Iniciar sesion
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Header>
        </>
    );
}

export default LoginPage;