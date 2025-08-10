import fs from 'fs'
import path, { resolve } from 'path'
import csv from 'csv-parser'
import { pool } from '../conexion_db.js'

export async function cargarUsuarios() {
    const rutaArchivo = path.resolve('server/data/01_usuarios.csv')
    const usuarios = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv())
            .on('data', (fila) => {
                usuarios.push([
                    fila.id_usuario,
                    fila.nombre_completo.trim(),
                    fila.numero_de_identificacion,
                    fila.correo,
                    fila.telefono
                ])
            })
            .on('end', async () => {
                try {
                    const sql = 'INSERT INTO usuarios (id_usuario,nombre_completo,numero_de_identificacion,correo,telefono) VALUES ?';
                    const [resultado] = await pool.query(sql, [usuarios])

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