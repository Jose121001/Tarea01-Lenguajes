const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require("cors");
const axios = require('axios');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'preguntados'
});

app.post('/create', (req, res) => {
  const nombre = req.body.nombre;
  db.query('INSERT INTO table_usuarios(name) VALUES(?)', [nombre], (err, result) => {
    if (err){
      console.log(err);
      res.status(500).send('Error al registrar usuario');
    }else {
      res.send('Usuario registrado con éxito');
    }
  });
});
let questionCount = 0;

app.get('/random_question', (req, res) => {
  if (questionCount >= 10) {
    res.send({ message: 'Has respondido todas las preguntas disponibles' });
    return;
  }

  db.query('SELECT * FROM table_preguntas ORDER BY RAND() LIMIT 1', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al obtener pregunta');
    } else {
      if (result.length > 0) {
        const pregunta = result[0];
        questionCount++;
        res.send(pregunta);
      } else {
        res.send({ message: 'No hay más preguntas disponibles' });
      }
    }
  });
});
//Crea una nueva ruta para reiniciar el contador questionCount:
app.put('/reset_question_count', (req, res) => {
  questionCount = 0;
  res.send('El contador de preguntas ha sido reiniciado');
});



app.post('/add_to_historial', (req, res) => {
  const { nombre, correctas } = req.body;
  db.query('INSERT INTO table_historial (nombre, correctas) VALUES (?, ?)', [nombre, correctas], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al agregar al historial');
    } else {
      res.send('Historial actualizado con éxito');
    }
  });
});

app.listen(3000, () => {
  console.log('Corriendo en el puerto 3000');
});
