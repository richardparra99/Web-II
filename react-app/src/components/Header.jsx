import { Button, Container, Form, Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    const onLogoutClick = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }
    const token = localStorage.getItem("token");

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
                        <button className="nav-link" onClick={onLogoutClick}>
                            Cerrar Sesion
                        </button>
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