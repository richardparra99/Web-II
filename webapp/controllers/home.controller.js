
const db = require("../models/");
const sha1 = require('sha1');

exports.getRoot = (req, res) => {
    res.render("home/index");
}
exports.getPrueba = (req, res) => {
    const nombres = ["Juan", "Pedro", "Maria"];
    res.render("prueba", { listaNombres: nombres })
}


exports.getHola = async (req, res) => {
    res.send('¡Hola Mundo!')
    await db.persona.create({
        nombre: "Juan",
        apellido: "Pérez",
        edad: 30,
        ciudad: "Santa Cruz",
        fechaNacimiento: new Date('1993-05-15')
    });
}
exports.getForm = (req, res) => {
    res.sendFile('form.html', { root: __dirname })
}
exports.postFormSubmit = (req, res) => {
    const name = req.query.name;
    const lastName = req.query.lastName;
    res.send(`Nombre: ${name}, Apellido: ${lastName}`);
}
exports.getMateriaSearch = async (req, res) => {
    const query = req.query.q;
    const materiaArr = await db.materia.findAll({
        where: {
            nombre: { [db.Sequelize.Op.like]: `%${query}%` }
        },
        include: 'docente'
    });
    res.render("materias/list", { materiaArr });
};
exports.getLogin = (req, res) => {
    res.render("usuario/login", { error: null });
};
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.usuario.findOne({ where: { email } });
        if (!user) {
            res.render('usuario/login', { error: 'Usuario o contraseña incorrectos' });
            return;
        }
        if (user.password !== sha1(password)) {
            res.render('usuario/login', { error: 'Usuario o contraseña incorrectos' });
            return;
        }
        req.session.userEmail = user.email;
        res.redirect("/");
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send("Error al iniciar sesión");
    }
}
exports.getRegister = (req, res) => {
    res.render("usuario/register", { error: null });
};
exports.postRegister = async (req, res) => {
    const { email, password, nombreCompleto } = req.body;

    try {
        const userWithEmail = await db.usuario.findOne({ where: { email } });
        if (userWithEmail) {
            res.render('usuario/register', { error: 'El email ya está en uso' });
            return;
        }
        await db.usuario.create({
            email,
            password: sha1(password),
            nombreCompleto
        });
        res.redirect("/login");
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send("Error al registrar usuario");
    }
};
exports.getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            res.status(500).send("Error al cerrar sesión");
            return;
        }
        res.redirect("/login");
    });
};