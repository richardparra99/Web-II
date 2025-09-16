const db = require("../models");

exports.getAllPersona = async (req, res) => {
    const personas = await db.persona.findAll();
    res.json(personas);
};

exports.getPersonaPorId = async (req, res) => {
        const persona = req.obj;
        res.json(persona);
}

exports.insertarPersona = async (req, res) => {
    const { nombre, apellido, edad, ciudad ,fechaNacimiento } = req.body;
    try {
        const nuevaPersona = await db.persona.create({
            nombre, apellido, edad, ciudad, fechaNacimiento
        });
        res.status(201).json(nuevaPersona);
    }catch (error) {
        return res.status(500).json({ error: 'Error al crear una persona'});
    }
};

exports.actualizarPersonaPatch = async (req, res) => {
    const { nombre, apellido, edad, ciudad ,fechaNacimiento } = req.body;

    try {
        const persona = req.obj;
        if(nombre){
            persona.nombre = nombre;
        }
        if(apellido){
            persona.apellido = apellido;
        }
        if(edad){
            persona.edad = edad;
        }
        if(ciudad){
            persona.ciudad = ciudad;
        }
        if(fechaNacimiento){
            persona.fechaNacimiento = fechaNacimiento;
        }
        await persona.save();

        res.json(persona);
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar persona'});
    }
}

exports.actualizarPersona = async (req, res) => {
    const { nombre, apellido, edad, ciudad, fechaNacimiento } = req.body;
    try {
        const persona = req.obj;

        persona.nombre = nombre;
        persona.apellido = apellido;
        persona.edad = edad;
        if (ciudad){
            persona.ciudad = ciudad;
        }
        if(fechaNacimiento){
            persona.fechaNacimiento = fechaNacimiento;
        }
        await persona.save();

        res.json(persona);
    }catch (error) {
        return res.status(500).json({ error: 'Error al actualizar persona'});
    }
}

exports.eliminarPersona = async (req, res) => {
    try {
        const persona = req.obj;
        await persona.destroy();
        res.json({ message: 'Persona eliminada correctamente'});
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar persona'});
    }
}