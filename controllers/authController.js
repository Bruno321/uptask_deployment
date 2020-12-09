const passport = require('passport')
const Usuarios = require('../models/Usuarios')
const Sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../handler/email')
const Op = Sequelize.Op

//utilidad que viene en node que nos ayuda a crear un token
const crypto = require('crypto')
// const { Sequelize } = require('sequelize/types')

//nombre de estrategia
exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//funcion paa revisar si el usuario esta logeado o no
exports.usuarioAutenticado = (req,res,next) => {
    //si el usuario esta autenteicado adelante
    if(req.isAuthenticated()){
        return next()
    }
    //sino redirigir al formulario
    return res.redirect('/iniciar-sesion')
}

//cerrar sesion
exports.cerrarSesion = (req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')
    })
}

//envia un token si el usuario es valido
exports.enviarToken = async (req,res,next)=>{
    // verificar q el usuarioe xiste
    const usuario = await Usuarios.findOne({where:{email:req.body.email}})

    //si no existe el usuario
    if(!usuario){
        req.flash('error','no existe esa cuenta')
        res.redirect('/reestablecer')
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000

    //guardar los daros
    await usuario.save()

    //url de reset
    const confirmarUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`
    // envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password reset',
        confirmarUrl,
        archivo: 'reestablecerPassword'
    })

    req.flash('correcto','se envio un mensaje a tu correo')
    res.redirect('iniciar-sesion')
}

exports.resetPassword = async (req,res,next) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    })

    //sino encuentra el usuario
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
    }

    // formulario para generar passwoird
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer password'
    })
}

//cambia el password
exports.actualizarPassword = async(req,res)=>{
    // verifica el token valido pero tambien la fecha de vencimiento 
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    })

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error','No valido')
        res.redirect('/reestablecer')
    }


    usuario.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null

    await usuario.save()

    req.flash('correcto','tu password se cambio exitosamente')
    res.redirect('/iniciar-sesion')
}