import axios from "axios";

const login = (loginData) => {
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:3000/auth/login", loginData)
        .then((response) => {
            resolve(response.data);
        }).catch((error) => {
            console.error(error);
            alert("Error al iniciar sesion");
            reject(error);
        })
    })
}

export {login}