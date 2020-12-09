const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handler/email')

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta',{
        nombrePagina: 'Crear cuenta en uptask'
    })
}

exports.formIniciarSesion = (req,res) => {
    const {error} = res.locals.mensajes
    res.render('iniciarSesion',{
        nombrePagina: 'Iniciar sesion en uptask',
        error
    })
}

exports.crearCuenta = async (req,res) => {
    //leer los datos
    const {email,password} = req.body

    try{
        //crear el usuario
        await Usuarios.create({
            email,
            password
        })

        //crear url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
        //crear el objeto de usuario
        const usuario = {
            email
        }
        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        })

        //redirigir al usuario
        req.flash('correcto','enviamos un correo confirma tu cuenta')
        res.redirect('/iniciar-sesion')
    }catch(error){
        //.map() va a crear diferentes elementos de errores, los errores los agrupa en 'error'
        req.flash('error',error.errors.map(error => error.message))
        res.render('crearCuenta',{
            nombrePagina: 'Crear cuenta en uptask',
            mensajes: req.flash(),
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req,res,next) => {
    res.render('reestablecer',{
        nombrePagina:'Reestablecer contraseña'
    })
}

//cambia el estado de una cuenta
exports.confirmarCuenta = async (req,res,next) => {
    const usuario = await Usuarios.findOne({where:{email:req.params.correo}})

    //si no existe
    if(!usuario){
        req.flash('error','no valido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1
    await usuario.save()

    req.flash('correcto','cuenta activada correcttamente')
    res.redirect('/iniciar-sesion')
    
}