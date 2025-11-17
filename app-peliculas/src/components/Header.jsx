import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import useAuthToken from "../../hooks/useAuthToken";
import { getAccessToken } from "../../utils/TokenUtilities";
import { Link } from "react-router-dom";

const Header = () => {
    const { doLogout, userEmail } = useAuthToken();
    const token = getAccessToken();

    const onLogoutClick = () => {
        doLogout();
    };

    return (
        <Navbar bg="danger" data-bs-theme="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Fast - Movie
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {token && (
                            <>
                                <Nav.Link as={Link} to="/peliculas/nueva">
                                    Nueva película
                                </Nav.Link>
                                <Nav.Link as={Link} to="/mis-reviews">
                                    Mis Reviews
                                </Nav.Link>
                            </>
                        )}
                    </Nav>

                    <Nav>
                        {token ? (
                            <NavDropdown title={userEmail || "Usuario"} id="user-dropdown">
                                <NavDropdown.Item onClick={onLogoutClick}>
                                    Cerrar sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/auth/login">
                                    Iniciar sesión
                                </Nav.Link>
                                <Nav.Link as={Link} to="/auth/register">
                                    Registrarse
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
