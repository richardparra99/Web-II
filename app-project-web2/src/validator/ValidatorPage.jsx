// src/validator/ValidatorPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Button,
    Container,
    Form,
    Spinner,
    Alert,
    Card,
} from "react-bootstrap";
import Header from "../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { validateQrToken } from "../../services/ValidationService";

const ValidatorPage = () => {
    // requiere login (el backend igual verifica rol VALIDATOR/ADMIN/ORGANIZER)
    useAuthentication(true);
    const [searchParams] = useSearchParams();

    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    // Si viene ?token=XXXX en la URL, lo cargamos automáticamente
    useEffect(() => {
        const urlToken = searchParams.get("token");
        if (urlToken) {
            setToken(urlToken);
        }
    }, [searchParams]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setResult(null);

        const trimmed = token.trim();
        if (!trimmed) {
            setErrorMsg("Ingresa un token de QR.");
            return;
        }

        try {
            setLoading(true);
            const data = await validateQrToken(trimmed);
            // data: { status, participantName?, eventTitle?, checkInAt? }
            setResult(data);
        } catch (err) {
            console.error(err);
            setErrorMsg("No se pudo validar el QR.");
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = () => {
        if (!result) return null;

        if (result.status === "INVALID") {
            return (
                <Alert variant="danger" className="mt-3">
                    <strong>Ingreso inválido.</strong> El código no corresponde
                    a una inscripción válida o confirmada.
                </Alert>
            );
        }

        if (result.status === "ALREADY_CHECKED_IN") {
            return (
                <Alert variant="warning" className="mt-3">
                    <strong>Entrada ya registrada.</strong>
                    <div>Participante: {result.participantName}</div>
                    <div>Evento: {result.eventTitle}</div>
                    {result.checkInAt && (
                        <div>
                            Ingreso registrado:{" "}
                            {new Date(result.checkInAt).toLocaleString("es-BO")}
                        </div>
                    )}
                </Alert>
            );
        }

        if (result.status === "VALID") {
            return (
                <Alert variant="success" className="mt-3">
                    <strong>Ingreso válido.</strong>
                    <div>Participante: {result.participantName}</div>
                    <div>Evento: {result.eventTitle}</div>
                    {result.checkInAt && (
                        <div>
                            Ingreso registrado:{" "}
                            {new Date(result.checkInAt).toLocaleString("es-BO")}
                        </div>
                    )}
                </Alert>
            );
        }

        // fallback por si el backend devuelve algo raro
        return (
            <Alert variant="secondary" className="mt-3">
                Resultado: {JSON.stringify(result)}
            </Alert>
        );
    };

    return (
        <>
            <Header />
            <Container className="main-page mt-3">
                <h1>Validación de QR</h1>
                <p className="text-muted">
                    Escanea el QR e ingresa el token, o pega el código para
                    validar la entrada del participante.
                </p>

                <Card className="mt-3">
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <Form.Group controlId="qrToken">
                                <Form.Label>Código / token del QR</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={token}
                                    onChange={(e) =>
                                        setToken(e.target.value)
                                    }
                                    placeholder=""
                                />
                            </Form.Group>

                            <div className="mt-3 d-flex align-items-center gap-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Validando..."
                                        : "Validar entrada"}
                                </Button>
                                {loading && (
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                    />
                                )}
                            </div>
                        </Form>

                        {errorMsg && (
                            <Alert
                                variant="danger"
                                className="mt-3"
                            >
                                {errorMsg}
                            </Alert>
                        )}

                        {renderStatus()}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ValidatorPage;
