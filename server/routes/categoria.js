const Categoria = require('./../models/categoria');
const express = require('express');
const { verificaToken, verificaAmin_Role } = require('../middlewares/autenticacion');
const app = express();


const options = {
  new: true,
  runValidators: true
};

// ===================================================
// Obtener todas las categoría
// ===================================================
app.get('/', [verificaToken], (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Categoria.find({})
    .sort('descripcion')
    .skip(desde)
    .limit(limite)
    .and({ estado: true })
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!categorias) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Categoria.count()
        .and({ estado: true })
        .exec((err, conteo) => {
          if (err) {
            return res.status(500).json({
              ok: false,
              err
            });
          }

          if (!conteo) {
            return res.status(400).json({
              ok: false,
              err
            });
          }

          return res.json({
            ok: true,
            categorias,
            total: conteo
          });

        })
    })
});

// ===================================================
// Mostrar una categoría por ID
// ===================================================
app.get('/:id', [verificaToken], (req, res) => {
  let id = req.params.id;

  Categoria.findById(id)
    .and({ estado: true })
    .exec((err, categoriaBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaBD) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No existe una categoría con ese id.',
          errors: { message: 'La categoría con el id: ' + id + ', no existe.' }
        });
      }

      return res.json({
        ok: true,
        categoria: categoriaBD
      });

    });
});

// ===================================================
// Crear nueva categoría
// ===================================================
app.post('/', [verificaToken], (req, res) => {
  let body = req.body;

  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.status(200).json({
      ok: true,
      categoria: categoriaBD
    });
  });
});

// ===================================================
// Actualizar categoría por ID
// ===================================================
app.put('/:id', [verificaToken], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let desCategoria = {
    descripcion: body.descripcion
  }

  Categoria.findOneAndUpdate({ _id: id }, desCategoria, options, (err, categoriaBD) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe una categoría con ese id.',
        errors: { message: 'La categoría con el id: ' + id + ', no existe.' }
      });
    }

    return res.json({
      ok: true,
      categoria: categoriaBD
    });
  });
});


// ===================================================
// Borrar una categoría por ID
// ===================================================
app.delete('/:id', [verificaToken, verificaAmin_Role], (req, res) => {
  let id = req.params.id;

  let cambiaEstado = {
    estado: false
  };

  Categoria.findOneAndUpdate({ _id: id }, cambiaEstado, options, (err, categoriaBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!categoriaBD) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe una categoría con ese id.',
        errors: { message: 'La categoría con el id: ' + id + ', no existe.' }
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBD
    });
  });
});



module.exports = {
  app
}