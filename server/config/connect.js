const mongoose = require('mongoose');

// Conectándose a mongodb
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(process.env.URLBD, (err) => {
    if (err) return err;

    console.log('Base de datos ONLINE!');
});

// ==============================
// Esta es otra manera de conección a la BD de Mongo a partir de la versión 4.
// mongoose.connect(process.env.URLBD, { useNewUrlParser: true })
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Error de conección:'));
// db.once('open', () => {
//     console.log(`Base de datos ONLINE!`);
// });
// ==============================