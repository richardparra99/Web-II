// src/admin/EventsStats.jsx
import { useEffect, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Spinner,
    Table,
} from "react-bootstrap";
import Header from "../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { getAdminEventStats } from "../../services/EventsService";

const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("es-BO", {
        dateStyle: "full",
        timeStyle: "short",
    });
};

const formatMoney = (value) => {
    const num = Number(value) || 0;
    return `${num.toFixed(2)} Bs`;
};

const EventsStats = () => {
    const { isAdmin } = useAuthentication(true); // requiere login y que sea admin

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await getAdminEventStats(
                from || undefined,
                to || undefined,
            );
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // cargar estadísticas sin filtro al entrar
        void loadStats();
        // eslint-disable-next-line
    }, []);

    if (!isAdmin) {
        return (
            <>
                <Header />
                <Container className="main-page mt-3">
                    <p>No tienes permisos para ver las estadísticas.</p>
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container className="main-page mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">Estadísticas de eventos</h1>
                </div>

                {/* Filtros por fecha */}
                <Card className="mb-3">
                    <Card.Body>
                        <Row className="gy-2 align-items-end">
                            <Col md={4}>
                                <Form.Group controlId="fromDate">
                                    <Form.Label>Desde (fecha de evento)</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="toDate">
                                    <Form.Label>Hasta</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Button
                                    variant="primary"
                                    onClick={loadStats}
                                    disabled={loading}
                                >
                                    {loading ? "Cargando..." : "Buscar"}
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {loading && (
                    <div className="text-center mt-4">
                        <Spinner animation="border" role="status" />
                        <span className="ms-2">
                            Cargando estadísticas de eventos...
                        </span>
                    </div>
                )}

                {!loading && stats && (
                    <>
                        {/* Resumen general */}
                        <Row className="gy-3 mb-3">
                            <Col md={3}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>Total de eventos</Card.Title>
                                        <h3>{stats.totalEvents}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>Inscripciones totales</Card.Title>
                                        <h3>{stats.totalRegistrations}</h3>
                                        <small className="text-muted">
                                            Confirmadas: {stats.totalConfirmed} ·
                                            Pendientes: {stats.totalPending} ·
                                            Canceladas: {stats.totalCancelled}
                                        </small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>Pagos</Card.Title>
                                        <p className="mb-1">
                                            <Badge bg="success" className="me-1">
                                                Aprobados
                                            </Badge>
                                            {stats.totalApprovedPayments}
                                        </p>
                                        <p className="mb-1">
                                            <Badge bg="warning" className="me-1">
                                                Pendientes
                                            </Badge>
                                            {stats.totalPendingPayments}
                                        </p>
                                        <p className="mb-0">
                                            <Badge bg="danger" className="me-1">
                                                Rechazados
                                            </Badge>
                                            {stats.totalRejectedPayments}
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>Recaudación total</Card.Title>
                                        <h3>{formatMoney(stats.totalRevenue)}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Tabla por evento */}
                        <div className="table-responsive mt-3">
                            <Table hover bordered size="sm">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Evento</th>
                                        <th>Fecha</th>
                                        <th>Ubicación</th>
                                        <th>Precio</th>
                                        <th>Capacidad</th>
                                        <th>Inscripciones</th>
                                        <th>Pagos</th>
                                        <th>Recaudación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.events.map((ev, index) => (
                                        <tr key={ev.eventId}>
                                            <td>{index + 1}</td>
                                            <td>{ev.title}</td>
                                            <td>{formatDateTime(ev.startDate)}</td>
                                            <td>{ev.location}</td>
                                            <td>
                                                {ev.price
                                                    ? formatMoney(ev.price)
                                                    : "Gratis"}
                                            </td>
                                            <td>{ev.capacity}</td>
                                            <td>
                                                <div>
                                                    Total: {ev.totalRegistrations}
                                                </div>
                                                <div>
                                                    <Badge
                                                        bg="primary"
                                                        className="me-1"
                                                    >
                                                        Confirmadas
                                                    </Badge>
                                                    {ev.confirmedRegistrations}
                                                </div>
                                                <div>
                                                    <Badge
                                                        bg="warning"
                                                        className="me-1"
                                                    >
                                                        Pendientes
                                                    </Badge>
                                                    {ev.pendingRegistrations}
                                                </div>
                                                <div>
                                                    <Badge
                                                        bg="secondary"
                                                        className="me-1"
                                                    >
                                                        Canceladas
                                                    </Badge>
                                                    {ev.cancelledRegistrations}
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <Badge
                                                        bg="success"
                                                        className="me-1"
                                                    >
                                                        Aprobados
                                                    </Badge>
                                                    {ev.approvedPayments}
                                                </div>
                                                <div>
                                                    <Badge
                                                        bg="warning"
                                                        className="me-1"
                                                    >
                                                        Pendientes
                                                    </Badge>
                                                    {ev.pendingPayments}
                                                </div>
                                                <div>
                                                    <Badge
                                                        bg="danger"
                                                        className="me-1"
                                                    >
                                                        Rechazados
                                                    </Badge>
                                                    {ev.rejectedPayments}
                                                </div>
                                            </td>
                                            <td>{formatMoney(ev.revenue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </>
                )}
            </Container>
        </>
    );
};

export default EventsStats;
