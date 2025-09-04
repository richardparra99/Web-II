require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser");
const db = require("./models/");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const flash = require('./middlewares/flash');

const app = express()
const port = 3000

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload({
    limits: {fielSize: 10 * 1024 * 1024},
}));

//configuracion de session
app.use(session({
    secret: 'esta es la clave de encriptación de la sesión y puede ser cualquier texto',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash);
app.use(require('./middlewares/usuario-actual'));



db.sequelize.sync({
    //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

require("./routes")(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
