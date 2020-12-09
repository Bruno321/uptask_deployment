const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios')

//local strategy - login con credenciales propias (usuarios y password)
passport.use(
    new LocalStrategy(
        // Por default passport espera un usuario y passsword
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email,password,done) => {
            try{
                const usuario = await Usuarios.findOne({
                    where:{
                        email,
                        activo: 1
                    }
                })
                //usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Email o password incorrecto'
                    })
                }
                //email existe password correcto
                return done(null, usuario)
            }catch{
                //ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
)

//serializar el usuario, ponerlo junto como un objeto
passport.serializeUser((usuario,callback)=>{
    callback(null,usuario)
})

//deserializar el usuario
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario)
})

module.exports = passport