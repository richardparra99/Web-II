import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const FormLogin = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


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
        sendLoginForm();
    }

    const sendLoginForm = () => {
        const loginData = {
            email,
            password
        }
        axios.post("http://localhost:3000/auth/login", loginData)
            .then((response) => {
                console.log(response.data);
                localStorage.setItem("token", response.data.token);
                navigate("/");
            }).catch((error) => {
                console.error(error);
                alert("Error al iniciar sesion");
            })
    }

    const onClickCancelar = () => {
        navigate("/");
    }

    return (
        <>
        <Header/>
        <Container>
            <Row className="mt-2">
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <Form noValidate validated={validated} onSubmit={onPersonaSaveClick}>
                                <Row>
                                    <Col>
                                    <h1>Iniciar Sesion</h1>
                                        <FormGroup>
                                            <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
                                            <FormControl id="txtEmail" required type="text" value={email} onChange={(e) => {
                                                setEmail(e.target.value);
                                            }} />
                                            <FormControl.Feedback type="invalid">El email es obligatorio</FormControl.Feedback>
                                        </FormGroup>
                                        <FormGroup>
                                            <RequiredLabel htmlFor="txtPassword">Password</RequiredLabel>
                                            <FormControl id="txtPassword" required type="password" value={password} onChange={(e) => {
                                                setPassword(e.target.value);
                                            }} />
                                            <FormControl.Feedback type="invalid">El password es obligatorio</FormControl.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="mt-2">
                                    <Button variant="success" type="submit">Iniciar sesion</Button>
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
 
export default FormLogin;