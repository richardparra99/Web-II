// src/components/Header.jsx
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/useAuthentication";

const Header = () => {
    const { doLogout, userEmail, isOrganizer, isAdmin } = useAuthentication();
    const token = getAccessToken();
    const isLogged = !!token;

    const onLogoutClick = () => {
        doLogout();
    };

    // participante = logueado pero NO admin y NO organizer
    const isPureParticipant = isLogged && !isAdmin && !isOrganizer;

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Event Planner
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        {/* VISITANTE (sin login): solo Eventos */}
                        {!isLogged && (
                            <Link className="nav-link" to="/">
                                Eventos
                            </Link>
                        )}

                        {/* PARTICIPANTE (logueado, NO admin, NO organizer) */}
                        {isPureParticipant && (
                            <>
                                <Link className="nav-link" to="/">
                                    Eventos
                                </Link>
                                <Link
                                    className="nav-link"
                                    to="/registrations/my"
                                >
                                    Mis inscripciones
                                </Link>
                            </>
                        )}

                        {/* ORGANIZADOR (logueado, NO admin) */}
                        {isLogged && isOrganizer && !isAdmin && (
                            <>
                                <NavDropdown
                                    title="Eventos"
                                    id="events-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/">
                                        Ver eventos
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/events/create"
                                    >
                                        Crear evento
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <Link
                                    className="nav-link"
                                    to="/registrations/my"
                                >
                                    Mis inscripciones
                                </Link>
                            </>
                        )}

                        {/* SOLO ADMIN: Administración (sin Eventos ni Mis inscripciones) */}
                        {isLogged && isAdmin && (
                            <NavDropdown
                                title="Administración"
                                id="admin-dropdown"
                            >
                                <NavDropdown.Item
                                    as={Link}
                                    to="/admin/users"
                                >
                                    Usuarios
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={Link}
                                    to="/admin/stats"
                                >
                                    Estadísticas
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>

                    <Nav>
                        {isLogged ? (
                            <NavDropdown
                                title={userEmail}
                                id="logout-dropdown"
                                align="end"
                            >
                                <button
                                    className="dropdown-item"
                                    onClick={onLogoutClick}
                                >
                                    Cerrar sesión
                                </button>
                            </NavDropdown>
                        ) : (
                            <>
                                <Link className="nav-link" to="/login">
                                    Iniciar sesión
                                </Link>
                                <Link className="nav-link" to="/register">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
