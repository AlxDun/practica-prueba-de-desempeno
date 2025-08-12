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

// 1. Ver todos los préstamos de un usuario
app.get('/prestamos/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.id_prestamo,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                l.isbn,
                l.titulo AS libro
            FROM prestamos p
            LEFT JOIN libros l ON p.isbn = l.isbn
            WHERE p.id_usuario = ?
        `, [id]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 2. Listar los 5 libros más prestados
app.get('/libros/mas-prestados', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.isbn,
                l.titulo,
                COUNT(p.id_prestamo) AS total_prestamos
            FROM prestamos p
            LEFT JOIN libros l ON p.isbn = l.isbn
            GROUP BY l.isbn, l.titulo
            ORDER BY total_prestamos DESC
            LIMIT 5
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 3. Listar usuarios con préstamos en estado "retrasado"
app.get('/usuarios/con-retrasos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT
                u.id_usuario,
                u.nombre_completo
            FROM prestamos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.estado = 'retrasado'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 4. Listar préstamos activos
app.get('/prestamos/activos', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id_prestamo, p.fecha_prestamo, p.fecha_devolucion, p.estado, u.nombre_completo AS usuario, l.titulo AS libro FROM prestamos p LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario LEFT JOIN libros l ON p.isbn = l.isbn WHERE p.estado = 'activo'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

// 5. Historial de un libro por su ISBN
app.get('/prestamos/historial/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const [rows] = await pool.query(`
            SELECT 
                p.id_prestamo,
                p.fecha_prestamo,
                p.fecha_devolucion,
                p.estado,
                u.nombre_completo AS usuario
            FROM prestamos p
            LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.isbn = ?
            ORDER BY p.fecha_prestamo DESC
        `, [isbn]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('http://localhost:3000')
})