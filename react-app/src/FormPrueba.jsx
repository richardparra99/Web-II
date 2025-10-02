import { useState } from "react";

const FormPrueba = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [ciudad, setCiudad] = useState("");
    return (
        <>
            <div>
                <label>Nombre: </label>
                <input type="text" onChange={(e) => {
                    setNombre(e.target.value);
                }} />
            </div>
            <div>
                <label>Apellido: </label>
                <input type="text" onChange={(e) => {
                    setApellido(e.target.value);
                }} />
            </div>
            <div>
                <label>Ciudad: </label>
                <input type="text" onChange={(e) => {
                    setApellido(e.target.value);
                }} />
            </div>
            <br />
                el valor de variable es: {nombre} {apellido}
        </>
    );
}
 
export default FormPrueba;