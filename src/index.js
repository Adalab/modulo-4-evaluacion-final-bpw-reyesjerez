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
  console.log("holis");
  const conn = await getConnection();

  const queryGetRecipies = `
    SELECT *
    FROM recetas
  `;

  const [results] = await conn.query(queryGetRecipies);

  conn.close();

  res.json({ info: { count: results.length }, results: results });
});

// // Guardar proyecto nuevo en la base de datos
// server.post("/api/projectCard", async (req, res) => {
//   // Datos vienen req.body
//   console.log("Ha llamado al POST");
//   console.log(req.body);

//   const {
//     name,
//     slogan,
//     technologies,
//     repo,
//     demo,
//     desc,
//     author,
//     job,
//     photo,
//     image,
//   } = req.body;

//   // 1. Conectar a la bbdd
//   if (
//     !name ||
//     name === "" ||
//     !slogan ||
//     slogan === "" ||
//     !technologies ||
//     technologies === "" ||
//     !repo ||
//     repo === "" ||
//     !demo ||
//     demo === "" ||
//     !desc ||
//     desc === "" ||
//     !author ||
//     author === "" ||
//     !job ||
//     job === "" ||
//     !photo ||
//     photo === "" ||
//     !image ||
//     image === ""
//   ) {
//     res.json({
//       success: false,
//       error: "",
//     });
//     return;
//   }
//   try {
//     const conn = await getConnection();

//     // 2. Insertar los datos de la autora  Users
//     const insertUser = `
//   INSERT INTO users (author, job, photo)
//   VALUES(?,?,?)`;

//     const [resultsInsertUser] = await conn.execute(insertUser, [
//       req.body.author,
//       req.body.job,
//       req.body.photo,
//     ]);

//     // 3. Recupero el id de Users
//     console.log(resultsInsertUser.insertId);
//     const fkUsers = resultsInsertUser.insertId;

//     // 4. Insertar el proyecto Projects(fkUsers)
//     const insertProject = `

//   INSERT  INTO projects (name, slogan, repo, demo, technologies, \`desc\`, image, fkUsers)
//   VALUES (?,?,?,?,?,?,?,?);`;

//     const [resultsInsertProject] = await conn.execute(insertProject, [
//       req.body.name,
//       req.body.slogan,
//       req.body.repo,
//       req.body.demo,
//       req.body.technologies,
//       req.body.desc,
//       req.body.photo,
//       fkUsers,
//     ]);

//     // 5. Recupero el id de Projects
//     const idProject = resultsInsertProject.insertId;
//     // 6. Cierro al conexion
//     conn.end();
//     // 7. Devuelvo el json
//     res.json({
//       success: true,
//       cardURL: `https://project-promo-a-pt-module-4-team-3.onrender.com/projectCard/${idProject}`,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       error: `Error en la base de datos`,
//     });
//   }
// });

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
