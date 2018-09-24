const express = require('express');

const app = express();

// Importando app de Routes
const usuarioRoute = require('./../routes/usuario').app;
const loginRoute = require('./../routes/login').app;

// Usando Middleware USE en Routes
app.use('/usuario', usuarioRoute);
app.use('/login', loginRoute);

// app.use(require('./usuario'));
// app.use(require('./login'));

module.exports = {
    app
}