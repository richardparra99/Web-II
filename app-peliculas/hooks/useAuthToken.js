import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";
import { getAccessToken, removeAccessToken, saveAccessToken } from "../utils/TokenUtilities";
import { useEffect } from "react";

const useAuthToken = (checkOnLoad = false) => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail") || "";

    const validateLogin = () => {
        const token = getAccessToken();
        if (!token) {
            navigate("/login");
        }
    };

    const dologin = (loginData) => {
        login(loginData)
            .then((response) => {
                const token = response.accessToken ?? response.token;
                saveAccessToken(token);
                localStorage.setItem("userEmail", loginData.email);
                navigate("/");
            })
            .catch(() => {
                alert("Error al iniciar sesion");
            });
    }

    const doLogout = () => {
        removeAccessToken();
        localStorage.removeItem("userEmail");
        navigate("/login");
    }

    useEffect(() => {
        if (!checkOnLoad) {
            return;
        }
        validateLogin()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    return {
        dologin, doLogout, userEmail
    }
};

export default useAuthToken;