import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import useAuthToken from "../../hooks/useAuthToken";
import { getAccessToken } from "../../utils/TokenUtilities";
import { Link } from "react-router-dom";

const Header = () => {
    const { dologout, userEmail } = useAuthToken();
    const token = getAccessToken();

    const onLogoutClick = () => {
        dologout();
    }

    return (
        <Navbar>
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Catalogo de peliculas
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                        {token && (
                            <>
                                <Link className="nav-link" to="/mis-reviews">
                                    Mis Reviews
                                </Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {token ? (
                            <NavDropdown title={userEmail || "Usuario"} id="user-dropdown">
                                <Button className="dropdown-item" onClick={onLogoutClick}>
                                    Cerrar sesion
                                </Button>
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
}

export default Header;