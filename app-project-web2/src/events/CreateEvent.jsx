import { useState } from "react";
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
import Header from "../components/Header";
import RequiredLabel from "../components/RequiredLabel";
import { createEvent, uploadEventPoster } from "../../services/EventsService";
import useAuthentication from "../../hooks/useAuthentication";

// Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// Centro por defecto (Santa Cruz aprox.)
const DEFAULT_POSITION = [-17.7833, -63.1833];

// Componente para manejar clicks en el mapa y mostrar el marcador
const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    if (!position) return null;

    return <Marker position={position} />;
};

const CreateEvent = () => {
    // obliga a estar logueado (aunque el rol lo valida el backend)
    useAuthentication(true);

    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");

    // archivo de imagen + preview local
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreviewUrl, setPosterPreviewUrl] = useState("");

    // posición en el mapa [lat, lng]
    const [mapPosition, setMapPosition] = useState(null);

    const onPosterFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPosterFile(null);
            setPosterPreviewUrl("");
            return;
        }
        setPosterFile(file);
        // preview local
        setPosterPreviewUrl(URL.createObjectURL(file));
    };

    const onFormSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        let hasErrors = false;

        if (form.checkValidity() === false) {
            hasErrors = true;
        }

        // Validación extra: obligar a marcar ubicación en el mapa
        if (!mapPosition) {
            alert("Debes marcar la ubicación del evento en el mapa.");
            hasErrors = true;
        }

        setValidated(true);
        if (hasErrors) return;

        const [lat, lng] = mapPosition;

        // 1) Si hay archivo, primero lo subimos con multer
        let posterUrlToSave = undefined;
        if (posterFile) {
            try {
                const uploadResp = await uploadEventPoster(posterFile);
                posterUrlToSave = uploadResp.url;
            } catch (err) {
                console.error(err);
                // si falla la subida de la imagen, no continuamos
                return;
            }
        }

        // 2) Crear el evento con los datos + URL del poster
        const eventData = {
            title,
            description,
            location,                 // texto (nombre del lugar / dirección)
            startDate,                // "YYYY-MM-DD" → válido para @IsDateString()
            capacity: Number(capacity),
            // DTO espera string numérica o nada
            price: price !== "" ? String(price) : undefined,
            posterUrl: posterUrlToSave, // puede ser undefined

            // nombres que el backend sí conoce
            latitude: lat,
            longitude: lng,
        };

        try {
            const created = await createEvent(eventData);
            navigate(`/events/${created.id}`);
        } catch {
            // createEvent ya muestra alert
        }
    };

    const onClickCancelar = () => {
        navigate("/");
    };

    return (
        <>
            <Header />
            <Container className="main-page">
                <Row className="mt-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h1>Crear evento</h1>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtTitle">
                                            Título
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtTitle"
                                            required
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            El título es obligatorio
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtDescription">
                                            Descripción
                                        </RequiredLabel>
                                        <FormControl
                                            as="textarea"
                                            rows={3}
                                            id="txtDescription"
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La descripción es obligatoria
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtLocation">
                                            Ubicación (texto)
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtLocation"
                                            required
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Ej: Auditorio UPSA, Bloque X"
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La ubicación es obligatoria
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    {/* Mapa para seleccionar la ubicación */}
                                    <FormGroup className="mb-3">
                                        <p className="mb-1">
                                            Haz clic en el mapa para marcar la ubicación exacta
                                        </p>
                                        <div style={{ height: "300px", width: "100%" }}>
                                            <MapContainer
                                                center={DEFAULT_POSITION}
                                                zoom={13}
                                                style={{ height: "100%", width: "100%" }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; OpenStreetMap contributors'
                                                />
                                                <LocationMarker
                                                    position={mapPosition}
                                                    setPosition={setMapPosition}
                                                />
                                            </MapContainer>
                                        </div>
                                        {mapPosition && (
                                            <small className="text-muted">
                                                Lat: {mapPosition[0].toFixed(5)} | Lng:{" "}
                                                {mapPosition[1].toFixed(5)}
                                            </small>
                                        )}
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtStartDate">
                                            Fecha
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtStartDate"
                                            required
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La fecha es obligatoria
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtCapacity">
                                            Capacidad
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtCapacity"
                                            required
                                            type="number"
                                            min={1}
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La capacidad debe ser mayor a 0
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <label htmlFor="txtPrice">Precio (opcional)</label>
                                        <FormControl
                                            id="txtPrice"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </FormGroup>

                                    {/* Input de archivo + preview */}
                                    <FormGroup className="mb-3">
                                        <label htmlFor="posterFile">
                                            Imagen del evento (opcional)
                                        </label>
                                        <FormControl
                                            id="posterFile"
                                            type="file"
                                            accept="image/*"
                                            onChange={onPosterFileChange}
                                        />
                                        {posterPreviewUrl && (
                                            <div className="mt-2">
                                                <p className="mb-1">Vista previa:</p>
                                                <img
                                                    src={posterPreviewUrl}
                                                    alt="Vista previa"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "200px",
                                                        borderRadius: "4px",
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </FormGroup>

                                    <div className="mt-2">
                                        <Button variant="success" type="submit">
                                            Crear
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

export default CreateEvent;
