import fs from 'fs'
import path, { resolve } from 'path'
import csv from 'csv-parser'
import { pool } from '../conexion_db.js'

export async function cargarPrestamos() {
    const rutaArchivo = path.resolve('server/data/03_prestamos.csv')
    const prestamos = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on('data', (fila) => {
                prestamos.push([
                    fila.id_prestamo,
                    fila.isbn,
                    fila.id_usuario,
                    fila.fecha_prestamo,
                    fila.fecha_devolucion,
                    fila.estado
                ])
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO prestamos (id_prestamo,isbn,id_usuario,fecha_prestamo,fecha_devolucion,estado) VALUES ?';
                    const [resultado] = await pool.query(sql, [prestamos])

                    console.log(resultado.affectedRows)
                    resolve()
                } catch (error) {
                    console.error('ELWESASOsss')
                    reject(error)

                }
            })
            .on('error', (error) => {
                console.error('ELWESASOsososo')
                reject(error)
            })
    })
}