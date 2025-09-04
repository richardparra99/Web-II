const db = require("../models/");

exports.getPersonaList = async (req, res) => {

    const personaArr = await db.persona.findAll();
    res.render("personas/list", { personaArr });
}

exports.getPersonaInsert = (req, res) => {
    res.render("personas/form", { persona: null });
}
exports.postPersonaInsert = async (req, res) => {
    const { nombre, apellido, edad, ciudad, fechaNacimiento } = req.body;
    await db.persona.create({
        nombre,
        apellido,
        edad,
        ciudad,
        fechaNacimiento
    });
    res.redirect('/personas');
}

exports.getPersonaUpdate = async (req, res) => {
    const persona = await db.persona.findByPk(req.params.id);
    res.render("personas/form", { persona });
}
exports.postPersonaUpdate = async (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, edad, ciudad, fechaNacimiento } = req.body;
    await db.persona.update({
        nombre,
        apellido,
        edad,
        ciudad,
        fechaNacimiento
    }, {
        where: { id }
    });
    res.redirect('/personas');
}

exports.postPersonaDelete = async (req, res) => {
    const id = req.params.id;
    await db.persona.destroy({
        where: { id }
    });
    res.redirect('/personas');
}
