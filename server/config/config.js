// =================
// Puerto
// =================
process.env.PORT = process.env.PORT || 3000;


// =================
// Entorno
// =================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================
// Base de Datos
// =================
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = 'mongodb://cafe-user:ABCD_123456@ds127300.mlab.com:27300/cafe';
}

process.env.URLBD = urlBD;