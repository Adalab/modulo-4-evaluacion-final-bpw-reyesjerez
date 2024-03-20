const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: "25mb" }));

// enlazar base de datos
// se crea esta función, que se usará cuando hagamos un endpoint donde queramos hacer una petición.
async function getConnection() {
  const connection = await mysql.createConnection({
    host: "127.0.0.1",
    database: "recetas_db",
    user: "root",
    password: "Rjpcp1993",
  });
  await connection.connect();
  return connection;
}

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// ENDPOINTS

// API Obtener todas las recetas

server.get("/api/recetas", async (req, res) => {
  const conn = await getConnection();

  const queryGetRecipies = `
    SELECT *
    FROM recetas
  `;

  const [results] = await conn.query(queryGetRecipies);

  conn.close();

  res.json({ info: { count: results.length }, results: results });
});

/