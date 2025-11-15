import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { getAccessToken, removeAccessToken, saveAccessToken } from "../utils/TokenUtilities";
import { login } from "../services/AuthService";

const useAuthentication = (checkOnLoad = false) => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail") || "";
    const validateLogin = () => {
        const token = getAccessToken();
        if (!token) {
            navigate("/login");
            return;
        }
    }

    const doLogin = (loginData) => {
        login(loginData).then((response) => {
            saveAccessToken(response.token);
            localStorage.setItem("userEmail", loginData.email);
            navigate("/");
        }).catch(() => {
            alert("Error al inciar sesion!")
        })
    }

    const doLogout = () => {
        removeAccessToken();
        navigate("/login");
    }

    useEffect(() => {
        if (!checkOnLoad) {
            return;
        }
        validateLogin();
        // eslint-disable-next-line
    }, [navigate]);
    return { doLogout, doLogin, userEmail }
}

export default useAuthentication;