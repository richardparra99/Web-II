import { Button, Container, Form, Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
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
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown title="Personas" id="navbarScrollingDropdown">
                <Link className="dropdown-item" to="/">Listas Personas</Link>
                <Link className="dropdown-item" to="/personas/create">
                    Crear Persona
                </Link>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}
 
export default Header;