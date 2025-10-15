import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/userAuthToken";

const Header = () => {

    const {doLogout, userEmail} = useAuthentication();
    const onLogoutClick = () => {
        doLogout();
    }
    const token = getAccessToken();

    return (
        <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >
                {token ? <>
                        <Link className="nav-link" to="/">Home</Link>
                        <NavDropdown title="Personas" id="navbarScrollingDropdown">
                            <Link className="dropdown-item" to="/">Listas Personas</Link>
                            <Link className="dropdown-item" to="/personas/create">
                                Crear Persona
                            </Link>
                        </NavDropdown>
                        <NavDropdown title={userEmail} id="logout-dropdown">
                            <button className="dropdown-item" onClick={onLogoutClick}>
                                Cerrar Sesion
                            </button>
                        </NavDropdown>
                    </> : <>
                        <Link className="nav-link" to="/login">Iniciar Sesion</Link>
                        <Link className="nav-link" to="/register">Registrarse</Link>
                </>}
            </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}
 
export default Header;