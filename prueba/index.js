const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 3000

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/hola', (req, res) => {
  res.send('Hola mundo!')
})

app.get('/form', (req, res) => {
    res.sendFile('form.html', {root:__dirname})
})

app.get("/prueba", (req, res) => {
    const nombres = ["juan", "pedro", "maria"];
    res.render('prueba', {listaNombres:nombres})
})

app.post('/form-submit', (req, res) =>{
  const name = req.body.name;
  const lastname = req.body.lastname;
  res.send(`Nombre: ${name}, Apellido: ${lastname}`)
})

app.get('/form-submit', (req, res) =>{
  const name = req.query.name;
  const lastname = req.query.lastname;
  res.send(`Nombre: ${name}, Apellido: ${lastname}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})