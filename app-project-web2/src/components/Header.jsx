import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/useAuthentication";

const Header = () => {
    const { doLogout, userEmail, isOrganizer, isAdmin, isValidator } =
        useAuthentication();
    const token = getAccessToken();
    const isLogged = !!token;

    // participante = logueado pero NO admin, NO organizer, NO validator
    const isPureParticipant =
        isLogged && !isAdmin && !isOrganizer && !isValidator;

    // 👇 ahora SOLO el rol validator puede ver esta opción
    const canValidate = isLogged && isValidator;

    const onLogoutClick = () => {
        doLogout();
    };

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

                        {/* PARTICIPANTE puro */}
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

                        {/* SOLO ADMIN: Administración */}
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

                        {/* VALIDACIÓN DE QR (solo VALIDATOR) */}
                        {canValidate && (
                            <Link className="nav-link" to="/validator">
                                Validar QR
                            </Link>
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
