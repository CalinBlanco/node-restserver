// Requerimos el config
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


// Importando app de Routes
const usuarioRoute = require('./routes/usuario').app;

// Usando Middleware USE en Routes
app.use('/usuario', usuarioRoute);

// Escuchando puerto para NODE
const port = process.env.PORT;

// Conectándose a mongodb
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(process.env.URLBD, (err) => {
    if (err) return err;

    console.log('Base de datos ONLINE!');
});

// ==============================
// Esta es otra manera de conección a la BD de Mongo a partir de la versión 4.
// mongoose.connect('mongodb://localhost:27017/cafe', { useNewUrlParser: true })
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Error de conección:'));
// db.once('open', () => {
//     console.log(`Base de datos ONLINE!`);
// });
// ==============================

// Desplegando el servidor NODE
app.listen(port, () => console.log(`Escuchando puerto: ${port}`));