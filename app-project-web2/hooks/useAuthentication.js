// src/hooks/useAuthentication.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAccessToken,
    removeAccessToken,
    saveAccessToken,
    getDecodedToken,
} from "../utils/TokenUtilities";
import { login } from "../services/AuthService";

const useAuthentication = (checkOnLoad = false) => {
    const navigate = useNavigate();

    const validateLogin = () => {
        const token = getAccessToken();
        if (!token) {
            navigate("/login");
            return;
        }
    };

    const doLogin = (loginData) => {
        login(loginData)
            .then((response) => {
                // Nest envía { accessToken: '...' }
                saveAccessToken(response.accessToken);

                const decoded = getDecodedToken();
                const email = decoded?.email ?? loginData.email ?? "";
                localStorage.setItem("userEmail", email);

                navigate("/");
            })
            .catch(() => {
                alert("Error al iniciar sesión");
            });
    };

    const doLogout = () => {
        removeAccessToken();
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    // Datos derivados del token
    const decoded = getDecodedToken();
    const userEmail =
        decoded?.email ?? localStorage.getItem("userEmail") ?? "";
    const roles = decoded?.roles ?? [];
    const isOrganizer = roles.includes("ORGANIZER");
    const isAdmin = roles.includes("ADMIN");

    useEffect(() => {
        if (!checkOnLoad) return;
        validateLogin();
        // eslint-disable-next-line
    }, [navigate]);

    return {
        doLogin,
        doLogout,
        userEmail,
        roles,
        isOrganizer,
        isAdmin,
    };
};

export default useAuthentication;
