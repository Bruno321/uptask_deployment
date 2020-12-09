//importar modelo
const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')

exports.proyectosHome = async (req,res) => {

    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})
    

    res.render('index',{
        nombrePagina : 'Proyectos',
        proyectos
    })

}

exports.formularioProyecto = async (req,res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})

    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req,res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})
    //enviar a consola lo que el usuario escriba
    // console.log(req.body)

    //validar que exista algo en el input
    const nombre = req.body.nombre
    let errores = []

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        })
        
    }else{
        //inserts
        //hook funcion que corre en determinado tiempo
        const usuarioId = res.locals.usuario.id
        await Proyectos.create({ nombre,usuarioId })
        res.redirect('/')
    }
}

exports.proyectoPorUrl = async (req,res,next) => {
    
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}})

    const proyectoPromise =  Proyectos.findOne({
        where : {
            url: req.params.url,
            usuarioId
        }
    })

    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise])

    //consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },//es como usar un join
        // ,
        // include : [
        //     {model: Proyectos}
        // ]
    })

    if(!proyecto) return next()
    

    res.render('tareas',{
        nombrePagina: 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req,res) => {

    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}})

    const proyectoPromise =  Proyectos.findOne({
        where : {
            id: req.params.id,
            usuarioId
        }
    })

    // Consultas que son independientes la una de la otra es mejor colocarlas en un Promise
    const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise])

    //render a la vista
    res.render('nuevoProyecto',{
        nombrePagina: 'Editar proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req,res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})
    //enviar a consola lo que el usuario escriba
    // console.log(req.body)

    //validar que exista algo en el input
    const nombre = req.body.nombre
    let errores = []

    if(!nombre){
        errores.push({'texto':'Agrega un nombre al proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        })
        
    }else{
        //inserts
        //hook funcion que corre en determinado tiempo
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id }}
        )
        res.redirect('/')
    }
}

exports.eliminarProyecto = async (req,res,next) => {
    //req.query o .params para leer los datos

    const {urlProyecto} = req.query

    const resultado = await Proyectos.destroy({where:{url: urlProyecto}})

    //por si se pierde la conexion con la base de datos
    if(!resultado){
        return next
    }

    res.send('Proyecto eliminado correctamente')
}