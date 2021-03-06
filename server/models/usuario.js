const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es una rol válido.'
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        uppercase: true,
        required: [true, 'El nombre es necesario.']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio.'],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único.' });

module.exports = mongoose.model('Usuario', usuarioSchema);