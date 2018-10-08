const express = require('express');

const app = express();

// Importando app de Routes
const loginRoute = require('./../routes/login').app;
const usuarioRoute = require('./../routes/usuario').app;
const categoriaRoute = require('./../routes/categoria').app;
const productoRoute = require('./../routes/producto').app;
const uploadRoute = require('./../routes/upload').app;
const imagenesRoute = require('./../routes/imagenes').app;

// Usando Middleware USE en Routes
app.use('/login', loginRoute);
app.use('/usuario', usuarioRoute);
app.use('/categoria', categoriaRoute);
app.use('/producto', productoRoute);
app.use('/upload', uploadRoute);
app.use('/imagen', imagenesRoute);

// app.use(require('./usuario'));
// app.use(require('./login'));

module.exports = {
    app
}