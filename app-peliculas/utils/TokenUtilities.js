const TOKEN_KEY = "accessToken";

const saveAccessToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const removeAccessToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export {
    saveAccessToken,
    getAccessToken,
    removeAccessToken,
};
