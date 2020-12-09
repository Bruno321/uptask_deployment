const express = require('express')
const routes = require('./routes')
const path = require('path')
const bodyParser = require('body-parser')
// const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./config/passport')

require('dotenv').config({path:'variables.env'})


//helpers con funciones usar./ para que node sepa q son archivos internos
const helpers = require('./helpers')
//crear la conexion a la bd
const db = require('./config/db')

//importar el modelo, sync crea los modelos y conecta a la bd
require('./models/Proyectos')
require('./models/Tareas')
require('./models/Usuarios')



db.sync()
    .then(()=> console.log('Conectado al servidor'))
    .catch(error=> console.log(error))

//crear app de express
const app = express()

//donde cargar archivos estaticos
app.use(express.static('public'))

//habilitar pug
app.set('view engine','pug')

// //agregamos express validator
// app.use(expressValidator())

//habilitar body parser para leer los datos del formulario, un req de http t ayuda a leer los datos
app.use(bodyParser.urlencoded({extended: true}))



//añadir carpeta de vistas
app.set('views',path.join(__dirname, './views'))

//agregar flash messages
app.use(flash())

app.use(cookieParser())

//sesiones 
app.use(session({
    secret: 'supersecreto',
    //si se quiere q alguien autenticado mantenga la sesion viva aunq no este haciendo nada
    resave: false,
    saveUninitialized: false,
}))

//arnaca una instancia de passport
app.use(passport.initialize())
app.use(passport.session())


//pasar vardump a la aplicacion,pasar una funcion para q este disponible en cualquier lugar de la app
//next funcion relacionada al middleware
app.use((req,res,next)=>{
    //res.local crea variables que pueden ser consumidas en otros archivos
    //wtf para  q sirve estar checar al FINAAAAAAAAAAAAAAAL
    res.locals.vardump = helpers.vardump
    res.locals.mensajes = req.flash()
    res.locals.usuario = {...req.user} || null
    next()
})

//middleware, no se usa '/' porq es el default
// app.use((req,res,next)=>{
//     console.log("yo soy middleware")
//     //si no se usa next, no llama al sig middleware
//     next()
// })

// app.use((req,res,next)=>{
//     console.log("yo soy otro middleware")
//     next()
// })



app.use('/',routes())
//servidor y puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.listen(port,host,()=>{
    console.log('el servior esta funcionando')
})


