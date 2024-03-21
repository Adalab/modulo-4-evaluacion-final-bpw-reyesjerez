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
    host: "localhost",
    database: "recetas_db",
    user: "root",
    password: "Rjpcp1993",
  });
  await connection.connect();
  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );
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

// Recuperar receta por id

server.get("/api/recetas/:id", async (req, res) => {
  const idReceta = req.params.id;

  try {
    const conn = await getConnection();

    const querysql = `
      SELECT *
        FROM recetas
        WHERE id = ?
    `;

    const [result] = await conn.query(querysql, [idReceta]);

    conn.end();

    res.json(result[0]);
  } catch (error) {
    res.json({
      success: false,
      error: "El id introducido no corresponde a ninguna receta.",
    });
  }
});

// Guardar una receta nueva en la base de datos

server.post("/api/recetas", async (req, res) => {
  const { nombre, ingredientes, instrucciones } = req.body;
  if (
    !nombre ||
    nombre === "" ||
    !ingredientes ||
    ingredientes === "" ||
    !instrucciones ||
    instrucciones === ""
  ) {
    res.json({
      success: false,
      error: "Todos los datos son obligatorios",
    });
    return;
  }
  try {
    const conn = await getConnection();

    const insertUser = `
         INSERT INTO recetas (nombre, ingredientes, instrucciones)
          VALUES(?,?,?)`;

    const [resultsInsertUser] = await conn.execute(insertUser, [
      nombre,
      ingredientes,
      instrucciones,
    ]);

    const newID = resultsInsertUser.insertId;

    conn.end();
    res.json({
      success: true,
      id: newID,
    });
  } catch (error) {
    res.json({
      success: false,
      error: `Error en la base de datos`,
    });
  }
});

// // Mostrar el detalle de un proyecto (serv. dinámicos)
// server.get("/projectCard/:id", async (req, res) => {
//   // Recibo el id del proyecto en un URL param
//   const idProjectCard = req.params.id;
//   console.log(req.params);

//   // 1. Conectar a la bbdd
//   const conn = await getConnection();

//   // 2. Lanzar un SELECT para recuperar 1 proyecto con el id <- req.params
//   const queryGetProjectCard = `
//   SELECT *
//   FROM projects
//   JOIN users
//   ON projects.fkUsers = users.idusers AND projects.idprojects = ?
//   `;
//   const [resultsProjectCard] = await conn.query(queryGetProjectCard, [
//     idProjectCard,
//   ]);

//   // 3. Hago un template, creando el fichero project.ejs

//   // 4. Cierro la conexión
//   conn.end();

//   // 5. res.render('plantilla', resultado)
//   res.render("project", resultsProjectCard[0]);
// });

// // crear servidor de estáticos

// // Crea un servidor de estáticos para los estilos en tu servidor:

// // Crea el fichero main.css de estilos en la carpeta src del servidor src/public-css/.

// // Configura el servidor de estáticos en index.js para que esté disponible el archivo css.

// // server.use(express.static("./src/public-css"));

// server.use(express.static("./public"));

// server.use(express.static("./public-react"));

// // Incluye el fichero main.css en la plantilla, presta mucha atención a la ruta del css. En la plantilla de la carpeta de views, quedaría asi:
// //<link rel=“stylesheet” href=“/main.css” />

// exports.server = server;
