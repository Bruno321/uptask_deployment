import Swal from 'sweetalert2'
import axios from 'axios'

const btnEliminar = document.querySelector('#eliminar-proyecto')
if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        //dataset se accede a los atributos personalizados
        const urlProyecto = e.target.dataset.proyectoUrl
        
        Swal.fire({
            title:'Estas seguro?',
            text:'No lo podras desaser',
            type:'warning',
            showCancelButton: true,
            confirmButtonColor:'#3085d6',
            cancelButtonColor:'#d33',
            confirmButtonText:'si, borralo!',
    
        }).then((result => {
            if(result.value){
                
                const url = `${location.origin}/proyectos/${urlProyecto}`

                axios.delete(url,{params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta)
                        Swal.fire(
                            'borrado',
                            'el archivo a sido borrado',
                            'success'
                        )
            
                        setTimeout(()=>{
                            window.location.href = '/'
                        },3000)
                    })
                    .catch(()=>{
                        Swal.fire({
                            type:'error',
                            title:'hubo un error',
                            text:'no se pudo eliminar'
                        })
                    }) 
            }
        }))
    })
}
export default btnEliminar