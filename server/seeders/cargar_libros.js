import fs from 'fs'
import path, { resolve } from 'path'
import csv from 'csv-parser'
import { pool } from '../conexion_db.js'

export async function cargarLibros() {
    const rutaArchivo = path.resolve('server/data/02_libros.csv')
    const libros = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on('data', (fila) => {
                libros.push([
                    fila.isbn,
                    fila.titulo,
                    fila.año_de_publicacion,
                    fila.autor
                ])
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO libros (isbn,titulo,año_de_publicacion,autor) VALUES ?';
                    const [resultado] = await pool.query(sql, [libros])

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