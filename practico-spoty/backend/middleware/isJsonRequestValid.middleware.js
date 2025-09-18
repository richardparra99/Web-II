const isJsonRequestValid = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0){
        return res.status(400).json({ error: 'el cuerpo de la solicitud esta vacio'})
    }
    next();
}

module.exports = {
    isJsonRequestValid
};