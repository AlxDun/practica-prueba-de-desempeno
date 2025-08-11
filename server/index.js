import express from "express"
import { pool } from "./conexion_db.js"

const app = express()
app.use(express.json())
app.get('/', async (request, response) => {
    console.log('ola mundo')
    response.send('holaaaaa')
})

app.get('/prestamos', async (request, response) => {
    try {
        const query = 'SELECT prestamos.id_prestamo as prestamo, usuarios.nombre_completo as usuario, libros.titulo, prestamos.estado FROM prestamos JOIN usuarios ON usuarios.id_usuario = prestamos.id_usuario JOIN libros ON libros.isbn = prestamos.isbn;'
        const [filas] = await pool.query(query)
        response.json(filas)
    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.get('/prestamos/:id_prestamo', async (request, response) => {
    try {
        const { id_prestamo } = request.params
        const query = 'SELECT prestamos.id_prestamo as prestamo, usuarios.nombre_completo as usuario, libros.titulo, prestamos.estado FROM prestamos JOIN usuarios ON usuarios.id_usuario = prestamos.id_usuario JOIN libros ON libros.isbn = prestamos.isbn WHERE id_prestamo = ?;'
        const [filas] = await pool.query(query, id_prestamo)
        response.json(filas[0])
    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.post('/prestamos', async (request, response) => {
    try {
        const {
            isbn,
            id_usuario,
            fecha_prestamo,
            fecha_devolucion,
            estado
        } = request.body

        const query = 'INSERT INTO prestamos (isbn, id_usuario, fecha_prestamo, fecha_devolucion, estado) VALUES (?, ?, ?, ?, ?);'

        const values = [
            isbn,
            id_usuario,
            fecha_prestamo,
            fecha_devolucion,
            estado
        ]

        const [result] = await pool.query(query, values)

        response.status(201).json({
            message: "prestamo creado exitosamente"
        })

    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.put('/prestamos/:id_prestamo', async (request, response) => {
    try {
        const { id_prestamo } = request.params

        const {
            isbn,
            id_usuario,
            fecha_prestamo,
            fecha_devolucion,
            estado
        } = request.body

        const query = 'UPDATE prestamos SET isbn = ?, id_usuario = ?, fecha_prestamo = ?, fecha_devolucion = ? , estado = ? WHERE id_prestamo = ?;'

        const values = [
            isbn,
            id_usuario,
            fecha_prestamo,
            fecha_devolucion,
            estado,
            id_prestamo
        ]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return response.json({ message: "prestamo actualizado" })
        }

    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.delete('/prestamos/:id_prestamo', async (request, response) => {
    try {
        const { id_prestamo } = request.params

        const query = 'DELETE FROM prestamos WHERE id_prestamo = ?;'

        const values = [id_prestamo]

        const [result] = await pool.query(query, values)

        if (result.affectedRows != 0) {
            return response.json({ message: "prestamo eliminado" })
        }

    } catch (error) {
        response.status(500).json({
            status: 'error',
            endpoint: request.originalUrl,
            method: request.method,
            message: error.message
        })
    }
})

app.listen(3000, () => {
    console.log('http://localhost:3000')
})