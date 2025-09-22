require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser");
const db = require("./models/");
//const fileUpload = require('express-fileupload');


const app = express()
const port = 3000

app.use(express.static('../frontend/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(fileUpload({
//     limits: {fielSize: 10 * 1024 * 1024},
// }));

db.sequelize.sync({
    //force: true // drop tables and recreate
    //alter: true // altera a la tabla para que coincida con los modelos
}).then(() => {
    console.log("db resync");
});

require("./routes")(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})