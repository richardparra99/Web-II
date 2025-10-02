import { useState } from "react";

const ListaDocente = () => {
    const [ListaDocente, setListaDocente] = useState([]);
    return ( 
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Ciudad</th>
                        <th>FechaNacimiento</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
     );

<div>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Ciudad</th>
                <th>FechaNacimiento</th>
            </tr>
        </thead>
    </table>
</div>}
 
export default ListaDocente;