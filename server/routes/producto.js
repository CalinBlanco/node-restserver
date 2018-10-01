const express = require('express');

const { verificaToken, verificaAmin_Role } = require('./../middlewares/autenticacion');
const Producto = require('./../models/producto');

const app = express();

const options = {
  new: true,
  runValidators: true
};

// ===================================================
// Obtener todos los Productos
// ===================================================
app.get('/', [verificaToken], (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  // let limite = req.query.limite || 5;
  // limite = Number(limite);

  Producto.find({})
    .sort('nombre')
    .skip(desde)
    .limit(5)
    .and({ estado: true })
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!productos) {
        return res.status(400).json({
          ok: false,
          err: { mensaje: 'No hay productos.' }
        });
      }

      Producto.count()
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
              err: { mensaje: 'No hay conteo de productos.' }
            });
          }

          return res.json({
            ok: true,
            productos,
            total: conteo
          });

        })
    })
});

// ===================================================
// Mostrar un producto por ID
// ===================================================
app.get('/:id', [verificaToken], (req, res) => {
  let id = req.params.id;

  Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .and({ estado: true })
    .exec((err, productoBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No existe un producto con ese id.',
          errors: { message: 'El producto con el id: ' + id + ', no existe.' }
        });
      }

      return res.json({
        ok: true,
        producto: productoBD
      });

    });
});

// ===================================================
// Buscar productos
// ===================================================
app.get('/buscar/:termino', [verificaToken], (req, res) => {
  let termino = req.params.termino;
  let regex = new RegExp(termino, 'i');

  Producto.find({ nombre: regex })
    .and({ estado: true })
    .populate('çategoria', 'descripcion')
    .exec((err, productosBD) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productosBD) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No existen productos con ese término.',
          errors: { message: 'El producto con el término: ' + termino + ', no existe.' }
        });
      }
      return res.json({
        ok: true,
        productos: productosBD
      })
    })
});


// ===================================================
// Crear nuevo producto
// ===================================================
app.post('/', [verificaToken], (req, res) => {
  let body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id
  });

  producto.save((err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.status(200).json({
      ok: true,
      producto: productoBD
    });
  });
});

// ===================================================
// Actualizar producto por ID
// ===================================================
app.put('/:id', [verificaToken], (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Producto.findById(id, (err, productoBD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoBD) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un producto con ese id.',
        errors: { message: 'El producto con el id: ' + id + ', no existe.' }
      });
    }

    productoBD.nombre = body.nombre;
    productoBD.precioUni = body.precioUni;
    productoBD.descripcion = body.descripcion;
    productoBD.categoria = body.categoria;
    productoBD.estado = body.estado;

    productoBD.save((err, productoActualizado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }
      return res.json({
        ok: true,
        producto: productoActualizado
      });
    });

  });

});

// ===================================================
// Borrar unproducto por ID
// ===================================================
app.delete('/:id', [verificaToken, verificaAmin_Role], (req, res) => {
  let id = req.params.id;

  let cambiaEstado = {
    estado: false
  };

  Producto.findById(id)
    .exec((err, productoBD) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      if (!productoBD) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No existe un producto con ese id.',
          errors: { message: 'El producto con el id: ' + id + ', no existe.' }
        });
      }

      productoBD.estado = false;

      productoBD.save((err, productoBorrado) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        }
        return res.json({
          ok: true,
          producto: productoBorrado,
          mensaje: 'Producto borrado.'
        });
      });

    });
});

module.exports = {
  app
}