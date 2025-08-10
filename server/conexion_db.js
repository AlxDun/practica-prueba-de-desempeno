import mysql from "mysql2/promise"

export const pool = mysql.createPool({
    host: "localhost",
    database: "biblioteca_easy",
    port: "3306",
    user: "root",
    password: "root",
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
})

async function probarConexion() {
    try {
        const connection = await pool.getConnection()
        console.log("Conexion correcta")
        connection.release();
    }
    catch (error) {
        console.error("ELWESO", error.message);
    }
}

probarConexion()