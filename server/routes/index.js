const express = require('express');

const app = express();

// Importando app de Routes
const loginRoute = require('./../routes/login').app;
const usuarioRoute = require('./../routes/usuario').app;
const categoriaRoute = require('./../routes/categoria').app;
const productoRoute = require('./../routes/producto').app;

// Usando Middleware USE en Routes
app.use('/login', loginRoute);
app.use('/usuario', usuarioRoute);
app.use('/categoria', categoriaRoute);
app.use('/producto', productoRoute);

// app.use(require('./usuario'));
// app.use(require('./login'));

module.exports = {
    app
}