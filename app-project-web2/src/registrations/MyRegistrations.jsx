// src/registrations/MyRegistrations.jsx
import { useEffect, useState } from "react";
import { Button, Container, Spinner, Table } from "react-bootstrap";
import Header from "../components/Header";
import {
    getMyRegistrations,
    cancelRegistration,
} from "../../services/RegistrationsService";

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState(null);

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            const data = await getMyRegistrations();
            setRegistrations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadRegistrations();
    }, []);

    const onCancelClick = async (id) => {
        if (!window.confirm("¿Seguro que quieres cancelar esta inscripción?")) {
            return;
        }
        try {
            setCancelingId(id);
            await cancelRegistration(id);
            await loadRegistrations();
        } catch (err) {
            console.error(err);
        } finally {
            setCancelingId(null);
        }
    };

    return (
        <>
            <Header />
            <Container className="main-page">
                <h1>Mis inscripciones</h1>

                {loading ? (
                    <div className="mt-3">
                        <Spinner animation="border" size="sm" /> Cargando...
                    </div>
                ) : registrations.length === 0 ? (
                    <p className="mt-3">Todavía no tienes inscripciones.</p>
                ) : (
                    <Table striped bordered hover size="sm" className="mt-3">
                        <thead>
                            <tr>
                                <th>Evento</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td>{reg.event?.title}</td>
                                    <td>
                                        {reg.event?.startDate
                                            ? new Date(reg.event.startDate).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td>{reg.status}</td>
                                    <td>
                                        {reg.status !== "CANCELLED" && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => onCancelClick(reg.id)}
                                                disabled={cancelingId === reg.id}
                                            >
                                                {cancelingId === reg.id
                                                    ? "Cancelando..."
                                                    : "Cancelar"}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </>
    );
};

export default MyRegistrations;
