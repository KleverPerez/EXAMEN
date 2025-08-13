const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Ruta para crear un estudiante
app.post('/estudiantes', (req, res) => {
  const { nombre, apellido, materia, nota_1p, nota_2p } = req.body;
  const promedio = (parseFloat(nota_1p) + parseFloat(nota_2p)) / 2;

  const sql = 'INSERT INTO estudiantes (nombre, apellido, materia, nota_1p, nota_2p, promedio) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nombre, apellido, materia, nota_1p, nota_2p, promedio], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al crear el estudiante' });
    }
    res.status(201).json({ message: 'Estudiante creado exitosamente', id: result.insertId });
  });
});

// Ruta para listar todos los estudiantes
app.get('/estudiantes', (req, res) => {
  const sql = 'SELECT * FROM estudiantes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener los estudiantes' });
    }
    res.json(results);
  });
});

// Ruta para actualizar un estudiante
app.put('/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, materia, nota_1p, nota_2p } = req.body;
  const promedio = (parseFloat(nota_1p) + parseFloat(nota_2p)) / 2;

  const sql = 'UPDATE estudiantes SET nombre = ?, apellido = ?, materia = ?, nota_1p = ?, nota_2p = ?, promedio = ? WHERE id = ?';
  db.query(sql, [nombre, apellido, materia, nota_1p, nota_2p, promedio, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el estudiante' });
    }
    res.json({ message: 'Estudiante actualizado exitosamente' });
  });
});

// Ruta para eliminar un estudiante
app.delete('/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM estudiantes WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar el estudiante' });
    }
    res.json({ message: 'Estudiante eliminado exitosamente' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});