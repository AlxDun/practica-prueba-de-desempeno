import { cargarUsuarios } from "./cargar_usuarios.js"
import { cargarLibros } from "./cargar_libros.js"
import { cargarPrestamos } from "./cargar_prestamos.js"

(async () => {
    try {
        console.log('ola')
        await cargarUsuarios()
        await cargarLibros()
        await cargarPrestamos()
        console.log('xum')
    } catch (error) {
        console.error('ono', error.message)
    } finally {
        process.exit()
    }
})()