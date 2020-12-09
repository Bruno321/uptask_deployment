import axios from "axios"
import Swal from "sweetalert2"

import {actualizarAvance} from '../funciones/avance'

const tareas = document.querySelector('.listado-pendientes')

if(tareas){
    
    tareas.addEventListener('click',e=>{

        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target
            const idTarea = icono.parentElement.parentElement.dataset.tarea

            //request a  /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`

            axios.patch(url,{idTarea})
                .then(function(respuesta){
                    if(respuesta.status == 200){
                        icono.classList.toggle('completo')

                        actualizarAvance()
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea
           
            
            Swal.fire({
                title:'Estas seguro?',
                text:'No lo podras desaser',
                type:'warning',
                showCancelButton: true,
                confirmButtonColor:'#3085d6',
                cancelButtonColor:'#d33',
                confirmButtonText:'si, borralo!',
                
            }).then((result) => {
                if(result.value){
                    
                    //enviar delete por axios
                    const url = `${location.origin}/tareas/${idTarea}`
                    
                    //delete requiere params en axiso
                    axios.delete(url,{params:{idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status == 200){
                                //es el padre
                                tareaHTML.parentElement.removeChild(tareaHTML)

                                Swal.fire(
                                    'Tarea eliminada',
                                    respuesta.data,
                                    'success'
                                )

                                actualizarAvance()
                            }
                        })
                }
            })
        }
    })
}
 export default tareas