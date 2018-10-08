const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// Este middleware coloca cualquier archivo enviado al objeto "req.file"
app.use(fileUpload());

app.put('/:tipo/:id', function (req, res) {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: "No se ha seleccionado ningún archivo."
      }
    });
  }

  //Validar tipo
  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: `Los tipos permitidos son: ${tiposValidos.join(', ')}`
      }
    });
  }

  // Se asigna el valor del input "archivo" a la variable archivo
  let archivo = req.files.archivo;

  let nombreCortado = archivo.name.split('.');
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // Extensiones permitidas.
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: `Las extensiones permitidas son: ${extensionesValidas.join(', ')}`,
        ext: extensionArchivo
      }
    });
  }

  // Cambiar nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  // Utilizamos el método mv() para mover el archivo a algún lugar del servidor.
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    // En este punto sabemos que la imagen ya esta cargada.

    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else if (tipo === 'productos') {
      imagenProducto(id, res, nombreArchivo);
    }
    else {
      borraArchivo(nombreArchivo, tipo);
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: `Los tipos permitidos son: ${tiposValidos.join(', ')}`
        }
      });
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioBD) => {
    if (err) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioBD) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: "El usuario no existe."
        }
      });
    }

    // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioBD.img}`);

    borraArchivo(usuarioBD.img, 'usuarios');

    usuarioBD.img = nombreArchivo;

    usuarioBD.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      });
    });


  });
}
function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoBD) => {
    if (err) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoBD) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: "El producto no existe."
        }
      });
    }

    // let pathImagen = path.resolve(__dirname, `../../uploads/productos/${productoBD.img}`);

    borraArchivo(productoBD.img, 'productos');

    productoBD.img = nombreArchivo;

    productoBD.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      });
    });


  });
}

function borraArchivo(nombreImagen, tipo) {
  let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = {
  app
}