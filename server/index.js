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

//Nueva ruta donde enviaremos la info del nombre a la DB
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

//Se creara una nueva ruta donde recibiremos la informacion de la DB
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

//Crea una nueva ruta para reiniciar el contador questionCount.
app.put('/reset_question_count', (req, res) => {
  questionCount = 0;
  res.send('El contador de preguntas ha sido reiniciado');
});

//Crea una nueva ruta donde se insertara la informacion correspondiente.
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


//Funcion encargada de mostrar la info de la DB del historial
app.get('/show_historial', (req, res) => {
  db.query('SELECT * FROM table_historial ORDER BY nombre', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al obtener historial.');
    } else {
      res.send(result);
    }
  });
});


app.listen(3000, () => {
  console.log('Corriendo en el puerto 3000');
});
