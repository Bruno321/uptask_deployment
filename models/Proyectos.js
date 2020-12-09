const Sequelize = require('sequelize')
const slug = require('slug')
const  shortid = require('shortid')
const db = require('../config/db')

const Proyectos = db.define('proyectos',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre : {
        type: Sequelize.STRING,

    },

    url :  Sequelize.STRING
},{
    hooks: {
        //existe una funcion que se ejecuta antes de que se inserte en la base de datos
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLowerCase()


            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
})

module.exports = Proyectos