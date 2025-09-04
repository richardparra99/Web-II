const db = require("../models/");

exports.getMateriaList = async (req, res) => {
    const materiaArr = await db.materia.findAll({
        include: 'docente'
    });
    res.render("materias/list", { materiaArr });
}

exports.postMateriaDelete = async (req, res) => {
    const id = req.params.id;
    await db.materia.destroy({
        where: { id }
    });
    res.redirect('/materias');
}

//El get siemper muestra el formulario
exports.getMateriaCreate = async (req, res) => {
    const docenteArr = await db.persona.findAll();
    res.render("materias/form", { materia: null, docenteArr });
}

//El post es para guardar los datos
exports.postMateriaCreate = async (req, res) => {
    const { nombre, descripcion, creditos, idDocente } = req.body;
    await db.materia.create({
        nombre,
        descripcion,
        creditos,
        idDocente
    });
    res.redirect('/materias');
}

exports.getMateriaById = async (req, res) => {
    const materia = await db.materia.findByPk(req.params.id);
    const docenteArr = await db.persona.findAll();
    res.render("materias/form", { materia, docenteArr });
}

exports.postMateriaUpdate = async (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion, creditos, idDocente } = req.body;
    await db.materia.update({
        nombre,
        descripcion,
        creditos,
        idDocente,
    }, {
        where: { id }
    });
    res.redirect('/materias');
};

