// src/events/EditEvent.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    FormControl,
    FormGroup,
    Row,
    Spinner,
} from "react-bootstrap";
import Header from "../components/Header";
import RequiredLabel from "../components/RequiredLabel";
import {
    getEventById,
    updateEvent,
    uploadEventPoster,
} from "../../services/EventsService";
import useAuthentication from "../../hooks/useAuthentication";

// Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const DEFAULT_POSITION = [-17.7833, -63.1833];

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    if (!position) return null;
    return <Marker position={position} />;
};

const EditEvent = () => {
    useAuthentication(true); // requiere login

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [validated, setValidated] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");

    const [posterFile, setPosterFile] = useState(null);
    const [posterPreviewUrl, setPosterPreviewUrl] = useState("");
    const [posterOriginalUrl, setPosterOriginalUrl] = useState("");

    const [mapPosition, setMapPosition] = useState(null);

    // Cargar datos del evento
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const ev = await getEventById(id);

                setTitle(ev.title || "");
                setDescription(ev.description || "");
                setLocation(ev.location || "");

                // convertir ISO -> YYYY-MM-DD
                setStartDate(
                    ev.startDate
                        ? new Date(ev.startDate).toISOString().slice(0, 10)
                        : "",
                );

                setCapacity(ev.capacity != null ? String(ev.capacity) : "");
                setPrice(ev.price != null ? String(ev.price) : "");

                if (ev.posterUrl) {
                    setPosterOriginalUrl(ev.posterUrl);
                    setPosterPreviewUrl(ev.posterUrl);
                }

                if (ev.latitude != null && ev.longitude != null) {
                    setMapPosition([ev.latitude, ev.longitude]);
                } else {
                    setMapPosition(DEFAULT_POSITION);
                }
            } catch (err) {
                console.error(err);
                alert("Error al cargar el evento para editar");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [id, navigate]);

    const onPosterFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPosterFile(null);
            setPosterPreviewUrl(posterOriginalUrl || "");
            return;
        }
        setPosterFile(file);
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

        if (!mapPosition) {
            alert("Debes marcar la ubicación del evento en el mapa.");
            hasErrors = true;
        }

        setValidated(true);
        if (hasErrors) return;

        const [lat, lng] = mapPosition;

        // 1) si el usuario seleccionó una nueva imagen, la subimos
        let posterUrlToSave = posterOriginalUrl || undefined;
        if (posterFile) {
            try {
                const uploadResp = await uploadEventPoster(posterFile);
                posterUrlToSave = uploadResp.url; // backend devuelve la URL completa
            } catch (err) {
                console.error(err);
                return;
            }
        }

        // 2) enviamos PATCH al backend
        const eventData = {
            title,
            description,
            location,
            startDate,
            capacity: Number(capacity),
            price: price !== "" ? String(price) : undefined,
            posterUrl: posterUrlToSave,
            latitude: lat,
            longitude: lng,
        };

        try {
            await updateEvent(id, eventData);
            alert("Evento actualizado correctamente");
            navigate(`/events/${id}`);
        } catch (err) {
            console.error(err);
        }
    };

    const onClickCancelar = () => {
        navigate(`/events/${id}`);
    };

    if (loading) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3 text-center">
                    <Spinner animation="border" role="status" />
                    <span className="ms-2">Cargando evento...</span>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="main-page">
                <Row className="mt-3">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h1>Editar evento</h1>
                                <Form
                                    noValidate
                                    validated={validated}
                                    onSubmit={onFormSubmit}
                                >
                                    <FormGroup className="mb-2">
                                        <RequiredLabel htmlFor="txtTitle">
                                            Título
                                        </RequiredLabel>
                                        <FormControl
                                            id="txtTitle"
                                            required
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setLocation(e.target.value)
                                            }
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La ubicación es obligatoria
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    {/* Mapa */}
                                    <FormGroup className="mb-3">
                                        <p className="mb-1">
                                            Haz clic en el mapa para marcar la
                                            ubicación exacta
                                        </p>
                                        <div
                                            style={{
                                                height: "300px",
                                                width: "100%",
                                            }}
                                        >
                                            <MapContainer
                                                center={
                                                    mapPosition ||
                                                    DEFAULT_POSITION
                                                }
                                                zoom={13}
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
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
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
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
                                            onChange={(e) =>
                                                setCapacity(e.target.value)
                                            }
                                        />
                                        <FormControl.Feedback type="invalid">
                                            La capacidad debe ser mayor a 0
                                        </FormControl.Feedback>
                                    </FormGroup>

                                    <FormGroup className="mb-2">
                                        <label htmlFor="txtPrice">
                                            Precio (opcional)
                                        </label>
                                        <FormControl
                                            id="txtPrice"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                        />
                                    </FormGroup>

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
                                                <p className="mb-1">
                                                    Vista previa:
                                                </p>
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
                                        <Button variant="primary" type="submit">
                                            Guardar cambios
                                        </Button>
                                        <Button
                                            variant="secondary"
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

export default EditEvent;
