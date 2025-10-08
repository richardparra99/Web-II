import axios from "axios";
import { useEffect, useState } from "react";

const ListaDocente = () => {
    const [listaDocente, setListaDocente] = useState([]);
    const fetchDocente = () => {
        axios.get("http://localhost:3000/personas")
        .then((response) => {
            setListaDocente(response.data);
            console.log(response.data);
        });
    }

    useEffect(() => {
        fetchDocente();
    }, [])
    return ( 
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>edad</th>
                        <th>Ciudad</th>
                        <th>Fecha de Nacimiento</th>
                    </tr>
                </thead>
                <tbody>
                    {listaDocente.map((Persona) =>(
                        <tr key={Persona.id}>
                        <td>{Persona.id}</td>
                        <td>{Persona.nombre}</td>
                        <td>{Persona.apellido}</td>
                        <td>{Persona.edad}</td>
                        <td>{Persona.ciudad}</td>
                        <td>{Persona.fechaNacimiento}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
     );
}
 
export default ListaDocente;