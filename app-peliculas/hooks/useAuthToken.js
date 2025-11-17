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
            navigate("/auth/login");
        }
    };

    const doLogin = (loginData) => {
        login(loginData)
            .then((response) => {
                const token =
                    response.access_token ||
                    response.token ||
                    response.accessToken;

                if (!token) {
                    alert("No se recibió token del servidor");
                    return;
                }

                saveAccessToken(token);
                localStorage.setItem("userEmail", loginData.email);
                navigate("/");
            })
            .catch(() => {
                alert("Error al iniciar sesión");
            });
    };

    const doLogout = () => {
        removeAccessToken();
        localStorage.removeItem("userEmail");
        navigate("/auth/login");
    };

    useEffect(() => {
        if (!checkOnLoad) return;
        validateLogin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { doLogin, doLogout, userEmail };
};

export default useAuthToken;
