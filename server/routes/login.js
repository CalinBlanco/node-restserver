const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email, estado: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: '(Usuario) y/o Password incorrecto(s)'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Usuario y/o (Password) incorrecto(s)'
                }
            });
            F
        }

        let token = jwt.sign({
            usuario: usuarioBD
        }, process.env.SEED, { expiresIn: process.env.EXPIRA_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });
});


module.exports = {
    app
}