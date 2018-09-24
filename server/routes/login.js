const express = require('express');
const Usuario = require('../models/usuario');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Autenticación mediante Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}
// verify().catch(console.error);


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: 'Debe de usar su autenticación normal.'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, { expiresIn: process.env.EXPIRA_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });
            }
        } else {
            // Si el usuario no existe en nuestra Base de Datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'TT_TT';

            usuario.save((err, usuarioBD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED, { expiresIn: process.env.EXPIRA_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                });
            });
        }
    });

    // res.json({
    //     usuario: googleUser
    // });

});


module.exports = {
    app
}