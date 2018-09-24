// Requerimos el config
require('./config/config');

const express = require('express');

const path = require('path');

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


// Configucarión global de rutas
app.use(require('./routes/index').app);

// Conectándose a MONGO
require('./config/connect');

// Desplegando el servidor NODE
app.listen(process.env.PORT, () => console.log(`Escuchando puerto: ${process.env.PORT}`));