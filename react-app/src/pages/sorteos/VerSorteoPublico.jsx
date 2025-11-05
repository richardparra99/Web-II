import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSorteoPorHash } from "../../../services/SorteoService";
import { seleccionarParticipante } from "../../../services/ParticipanteService";
import { Button, Container, Table, Alert, Spinner } from "react-bootstrap";
import Header from "../../components/Header"; // ✅ Importamos el Header

const VerSorteoPublico = () => {
    const { hash } = useParams();
    const [sorteo, setSorteo] = useState(null);
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seleccionado, setSeleccionado] = useState(false);

    // 🔹 Cargar el sorteo por hash
    useEffect(() => {
        getSorteoPorHash(hash)
            .then((data) => {
                setSorteo(data);
                setLoading(false);
            })
            .catch(() => {
                alert("Sorteo no encontrado o no iniciado.");
                setLoading(false);
            });
    }, [hash]);

    // 🔹 Seleccionar participante (una vez)
    const onSelect = async (idParticipante) => {
        if (!window.confirm("¿Confirmas que este es tu nombre?")) return;

        try {
            const res = await seleccionarParticipante(idParticipante);
            setResultado(res);
            setSeleccionado(true);
        } catch (error) {
            console.log(error);
            alert("Este participante ya fue identificado o hubo un error.");
        }
    };

    // 🔄 Estado de carga
    if (loading) {
        return (
            <>
                <Header />
                <Container className="text-center mt-5">
                    <Spinner animation="border" />
                    <p className="mt-3">Cargando sorteo...</p>
                </Container>
            </>
        );
    }

    // ❌ Sorteo no encontrado
    if (!sorteo) {
        return (
            <>
                <Header />
                <Container className="mt-5 text-center">
                    <Alert variant="danger">Sorteo no encontrado o no disponible</Alert>
                </Container>
            </>
        );
    }

    // ✅ Pantalla principal
    return (
        <>
            <Header />
            <Container className="mt-4">
                <h2 className="mb-3 text-center">{sorteo.nombre}</h2>

                {!seleccionado ? (
                    <>
                        <p className="text-center">
                            Selecciona tu nombre para descubrir a quién te toca regalar
                        </p>

                        <Table bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorteo.participantes.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.nombre}</td>
                                        <td className="text-center">
                                            {p.identificado ? (
                                                <span className="text-muted">Ya escogido</span>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => onSelect(p.id)}
                                                >
                                                    Elegir
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <div className="text-center mt-5">
                        <Alert variant="success">
                            <h4>¡Hola {resultado.tuNombre}!</h4>
                            <p>Te tocó regalarle a:</p>
                            <h3 className="fw-bold">{resultado.teToco}</h3>

                            {/* ✅ Wishlist del amigo secreto */}
                            {resultado.wishlistAmigo && (
                                <p className="mt-3">
                                    <strong>Wishlist:</strong>{" "}
                                    <em>{resultado.wishlistAmigo}</em>
                                </p>
                            )}

                            <p className="mt-3 text-muted">
                                (Guarda este nombre, no podrás volver a entrar)
                            </p>
                        </Alert>
                    </div>
                )}
            </Container>
        </>
    );
};

export default VerSorteoPublico;
