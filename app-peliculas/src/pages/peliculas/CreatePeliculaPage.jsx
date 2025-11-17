import { useState } from "react";
import useAuthToken from "../../../hooks/useAuthToken";
import Header from "../../components/Header";
import { crearPelicula } from "../../../services/PeliculasService";
import { useNavigate } from "react-router-dom";
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
import moment from "moment";

const CreatePeliculaPage = () => {
    // protege la página: si no hay token, te manda a login
    useAuthToken(true);
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [anio, setAnio] = useState("");          // aquí guardamos el valor del <input type="date">
    const [imagenFile, setImagenFile] = useState(null);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        let hasErrors = false;

        if (form.checkValidity() === false) {
            hasErrors = true;
        }

        setValidated(true);
        if (hasErrors) return;

        try {
            // anio viene como "2025-11-13" porque el input es type="date"
            const fechaMoment = moment(anio, "YYYY-MM-DD");

            if (!fechaMoment.isValid()) {
                alert("Fecha inválida");
                return;
            }

            const soloAnio = fechaMoment.year(); // ej: 2025

            const formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("anio", soloAnio.toString()); // lo mandamos como string

            if (imagenFile) {
                formData.append("imagen", imagenFile);
            }

            await crearPelicula(formData);
            alert("Película creada correctamente");
            navigate("/");
        } catch (error) {
            console.error("Error al crear película:", error.response?.data || error);
            alert("Error al crear la película");
        }
    };

    return (
        <>
            <Header />
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h2>Nueva película</h2>

                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    {/* Título */}
                                    <FormGroup className="mt-2">
                                        <RequiredLabel htmlFor="txtTitulo">Título</RequiredLabel>
                                        <FormControl
                                            id="txtTitulo"
                                            required
                                            type="text"
                                            value={titulo}
                                            onChange={(e) => setTitulo(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            El título es obligatorio
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    {/* Fecha (usamos type="date") */}
                                    <FormGroup className="mt-2">
                                        <RequiredLabel htmlFor="txtAnio">Fecha</RequiredLabel>
                                        <FormControl
                                            id="txtAnio"
                                            required
                                            type="date"
                                            value={anio}
                                            onChange={(e) => setAnio(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La fecha es obligatoria
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    {/* Imagen */}
                                    <FormGroup className="mt-2">
                                        <RequiredLabel htmlFor="fileImagen">Imagen</RequiredLabel>
                                        <FormControl
                                            id="fileImagen"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setImagenFile(e.target.files[0] || null)
                                            }
                                        />
                                    </FormGroup>

                                    <div className="mt-3">
                                        <Button type="submit" variant="success">
                                            Guardar
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="ms-2"
                                            onClick={() => navigate("/")}
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

export default CreatePeliculaPage;
