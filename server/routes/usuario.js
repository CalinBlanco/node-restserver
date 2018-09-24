const express = require('express');
const Usuario = require('../models/usuario');

const { verificaToken, verificaAmin_Role } = require('../middlewares/autenticacion');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const app = express();

const options = {
    new: true,
    runValidators: true
}


app.get('/', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email estado google role')
        .skip(desde)
        .limit(limite)
        .and({ estado: true })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count()
                .and({ estado: true })
                .exec((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        usuarios,
                        total: conteo
                    });

                })
        })

});

app.post('/', [verificaToken, verificaAmin_Role], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // usuarioBD.password = null;

        res.status(200).json({
            ok: true,
            persona: usuarioBD
        });
    });
});

app.put('/:id', [verificaToken, verificaAmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, options, (err, usuarioActualizado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    });

});

app.delete('/:id', [verificaToken, verificaAmin_Role], (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, options, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id.',
                errors: { message: 'El usuario con el id: ' + id + ', no existe.' }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });


    // Usuario.findById({ _id: id })
    //     .and({ estado: true })
    //     .exec((err, usuario) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         if (!usuario) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 mensaje: 'No existe un usuario con ese id.',
    //                 errors: { message: 'El usuario con el id: ' + id + ', no existe.' }
    //             });
    //         }

    //         usuario.estado = false;

    //         usuario.save((err, usuarioBorrado) => {
    //             if (err) {
    //                 return res.status(400).json({
    //                     ok: false,
    //                     mensaje: 'Error al borrar usuario',
    //                     errors: err
    //                 });
    //             }

    //             res.json({
    //                 ok: true,
    //                 usuario: usuarioBorrado
    //             });
    //         })

    //     });
});

module.exports = {
    app
}