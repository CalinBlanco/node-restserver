// =================
// Puerto
// =================
process.env.PORT = process.env.PORT || 3000;


// =================
// Entorno
// =================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================
// Expiración de Token  (60seg, 60min, 24hrs y 30 días)
// =================
process.env.EXPIRA_TOKEN = "30 days";

// =================
// SEED (semilla)
// =================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// =================
// Base de Datos
// =================
let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;