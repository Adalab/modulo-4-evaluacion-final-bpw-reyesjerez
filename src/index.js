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

  const queryGetRecetas = `
    SELECT *
    FROM recetas
  `;

  const [results] = await conn.query(queryGetRecetas);

  conn.close();

  res.json({ info: { count: results.length }, results: results });
});

// Recuperar receta por id

server.get("/api/recetas/:id", async (req, res) => {
  const idReceta = parseInt(req.params.id);

  if (!idReceta || idReceta === "" || !Number.isInteger(idReceta)) {
    res.json({
      success: false,
      error: "El id introducido no corresponde a ninguna receta.",
    });
    return;
  }
  try {
    const conn = await getConnection();

    const queryOneReceta = `
      SELECT *
        FROM recetas
        WHERE id = ?
    `;

    const [result] = await conn.query(queryOneReceta, [idReceta]);

    conn.end();

    if (result.length !== 1) {
      res.json({
        success: false,
        error: "El id introducido no corresponde a ninguna receta.",
      });
    } else {
      res.json(result[0]);
    }

    //onsole.log(result);
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

    const insertReceta = `
         INSERT INTO recetas (nombre, ingredientes, instrucciones)
          VALUES(?,?,?)`;

    const [resultsNewReceta] = await conn.execute(insertReceta, [
      nombre,
      ingredientes,
      instrucciones,
    ]);

    const newID = resultsNewReceta.insertId;

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

// Actualizar recetas

server.put("/api/recetas/:id", async (req, res) => {
  const idReceta = parseInt(req.params.id);
  const { nombre, ingredientes, instrucciones } = req.body;

  if (
    !idReceta ||
    idReceta === "" ||
    !Number.isInteger(idReceta) ||
    !nombre ||
    nombre === "" ||
    !ingredientes ||
    ingredientes === "" ||
    !instrucciones ||
    instrucciones === ""
  ) {
    res.json({
      success: false,
      error: "Revise que ha rellenado TODOS los campos correctamente.",
    });
    return;
  }

  try {
    const conn = await getConnection();

    const queryUpdate = `
          UPDATE recetas
          SET nombre = ?, ingredientes = ?, instrucciones = ?
          WHERE id = ?`;

    const [recetaUpdated] = await conn.execute(queryUpdate, [
      nombre,
      ingredientes,
      instrucciones,
      idReceta,
    ]);

    conn.end();

    if (recetaUpdated.affectedRows === 1) {
      res.json({
        success: true,
        message: "La receta se ha actualizado correctamente.",
      });
    } else {
      res.json({
        success: false,
        error: "La receta no ha sido actualizada correctamente.",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: "La receta no se ha podido actualizar.",
    });
  }
});

// eliminar receta

server.delete("/api/recetas/:id", async (req, res) => {
  const idReceta = parseInt(req.params.id);
  if (!idReceta || idReceta === "" || !Number.isInteger(idReceta)) {
    res.json({
      success: false,
      error: "El id indicado no es válido.",
    });
    return;
  }

  try {
    const conn = await getConnection();

    const queryDelete = `
          DELETE FROM recetas
          WHERE id = ?;`;

    const [recetaDeleted] = await conn.execute(queryDelete, [idReceta]);

    conn.end();
    if (recetaDeleted.affectedRows === 1) {
      res.json({
        success: true,
        message: "La receta ha sido eliminada.",
      });
    } else {
      res.json({
        success: false,
        error: "Ninguna receta ha sido eliminada.",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error: "La receta no se ha podido eliminar.",
    });
  }
});
