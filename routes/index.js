const express = require('express')
const router = express.Router()
//depende lo que deseas validar es lo q usas (bvody, header etc)
const {body} = require('express-validator')

const proyectosControllers = require('../controllers/proyectosControllers')
const tareasController = require('../controllers/tareasController')
const usuariosController = require('../controllers/usuariosController')
const authController = require('../controllers/authController')

module.exports = function(){
    //ruta del home, en vez de tener la funcion ahi puesta se agarra del controller
    router.get('/',
        authController.usuarioAutenticado,
        proyectosControllers.proyectosHome
    )

    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosControllers.formularioProyecto
    )
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControllers.nuevoProyecto
    )

    router.get('/nosotros',(req,res) => {
        res.render('nosotros')
    })

    //listar proyecto
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosControllers.proyectoPorUrl
    )
    
    //Actualizar el proeycto
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosControllers.formularioEditar
    )
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControllers.actualizarProyecto
    )


    //Eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,    
        proyectosControllers.eliminarProyecto
    )
    
    //tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    )

    //actualizar tarea,  patch no cambia todo el objeto
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,  
        tareasController.cambiarEstadoTarea
    )

    //eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    )

    // crear nueva cuenta
    router.get('/crear-cuenta',usuariosController.formCrearCuenta)
    router.post('/crear-cuenta',usuariosController.crearCuenta)
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta)

    //iniciar seison
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion)
    router.post('/iniciar-sesion',authController.autenticarUsuario)

    //cerrar sesion
    router.get('/cerrar-sesion',authController.cerrarSesion)
    
    //restablecer contraseña
    router.get('/reestablecer',usuariosController.formRestablecerPassword)
    router.post('/reestablecer',authController.enviarToken)
    router.get('/reestablecer/:token',authController.resetPassword)
    router.post('/reestablecer/:token',authController.actualizarPassword)

    return router
}
