// src/components/Header.jsx
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccessToken } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/useAuthentication";

const Header = () => {
    const { doLogout, userEmail, isOrganizer, isAdmin } = useAuthentication();
    const token = getAccessToken();

    const onLogoutClick = () => {
        doLogout();
    };

    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Event Planner
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        <Link className="nav-link" to="/">
                            Eventos
                        </Link>

                        {token && (
                            <Link
                                className="nav-link"
                                to="/registrations/my"
                            >
                                Mis inscripciones
                            </Link>
                        )}

                        {/* SOLO ORGANIZER o ADMIN */}
                        {token && (isOrganizer || isAdmin) && (
                            <Link
                                className="nav-link"
                                to="/events/create"
                            >
                                Crear evento
                            </Link>
                        )}
                    </Nav>

                    <Nav>
                        {token ? (
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
