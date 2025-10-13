import { useState } from "react";
import { Button, Card, Col, Container, Form, FormControl, FormGroup, Row } from "react-bootstrap";
import RequiredLabel from "../../components/RequiredLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const FormRegister = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombreCompleto, setNombreCompleto] = useState("");


    const onFormSubmit = (e) => {
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
        sendRegisterForm();
    }

    const sendRegisterForm = () => {
        const registerData = {
            email,
            password,
            nombreCompleto
        }
        axios.post("http://localhost:3000/auth/register", registerData)
            .then((response) => {
                console.log(response.data);
                localStorage.setItem("token", response.data.token);
                navigate("/login");
            }).catch((error) => {
                console.error(error);
                alert("Error al registrarse");
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
                            <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                <Row>
                                    <Col>
                                    <h1>Registrarse!</h1>
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
                                        <FormGroup>
                                            <RequiredLabel htmlFor="txtNombreCompleto">Nombre Completo</RequiredLabel>
                                            <FormControl id="txtNombreCompleto" required type="text" value={nombreCompleto} onChange={(e) => {
                                                setNombreCompleto(e.target.value);
                                            }} />
                                            <FormControl.Feedback type="invalid">El Nombre completo es obligatorio</FormControl.Feedback>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <div className="mt-2">
                                    <Button variant="success" type="submit">Registrar</Button>
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
 
export default FormRegister;