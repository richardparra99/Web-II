const db = require("../models");

exports.getAllPersona = async (req, res) => {
    const personas = await db.persona.findAll();
    res.json(personas);
};

exports.getPersonaPorId = async (req, res) => {
    const {id} = req.params;
    try {
        const persona = await db.persona.findByPk(id);
        if(!persona){
            return res.status(404).json({ error: 'Persona no encontrada'});
        }
        res.json(persona);
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener a la persona'})
    }
}

exports.insertarPersona = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0){
        return res.status(400).json({ error: 'el cuerpo de la solicitud esta vacio'})
    }


    const { nombre, apellido, edad, ciudad ,fechaNacimiento } = req.body;
    const validations = checkValidations(req.body, ["nombre", "apellido", "edad"]);
    if (validations){
        return res.status(400).json({ error: validations});
    }
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
    const {id} = req.params;
    if (!req.body || Object.keys(req.body).length === 0){
        return res.status(400).json({ error: 'el cuerpo de la solicitud esta vacio'})
    }
    const { nombre, apellido, edad, ciudad ,fechaNacimiento } = req.body;

    try {
        const persona = await db.persona.findByPk(id);
        if (!persona){
            return res.status(404).json({ error: 'Persona no encontrada'});
        }

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
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'el cuerpo de la solicitud esta vacio' });
    }

    const { nombre, apellido, edad, ciudad, fechaNacimiento } = req.body;
    const validations = checkValidations(req.body, ["nombre", "apellido", "edad"]);
    if (validations) {
        return res.status(400).json({ error: validations });
    }

    try {
        const persona = await db.persona.findByPk(id);
        if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
        }

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
    const {id} = req.params;
    try {
        const persona = await db.persona.findByPk(id);
        if(!persona){
            return res.status(404).json({ error: 'Persona no encontrada'});
        }
        await persona.destroy();
        res.json({ message: 'Persona eliminada correctamente'});
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar persona'});
    }
}


const checkValidations = (data, requiredFields) => {
    const missingFields = requiredFields.filter(field => !(field in data));
    if (missingFields.length > 0){
        return `Faltan campos requeridos: ${missingFields.join(", ")}`
    }
    return null;
}