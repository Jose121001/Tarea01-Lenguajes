const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require("cors");

app.use(cors());
//Toda la informacion pasara a ser formato json.
app.use(express.json());

//Conexion a la BD 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'preguntados'
});

//Datos que enviamos desde el form del name
app.post('/create', (req, res) => {
  const nombre = req.body.nombre;

  // Envío de la información a la base de datos.
  // VALUES(?) se utiliza para indicar que se enviarán esos valores
  // ,[nombre] lista de valores que se reemplazan por los valores que se capturan.
  db.query('INSERT INTO table_usuarios(name) VALUES(?)', [nombre], (err, result) => {
    if (err){
      console.log(err);
      res.status(500).send('Error al registrar usuario');
    }else {
      res.send('Usuario registrado con éxito');
    }
  });
});
//-----------------Fin de instrucciones de Insersion de Dta------------------------------------


/**
 * Solicitud de datos a la tabla: table_preguntas.
 * Esto se dirige a la zona de preguntas y respuestas.
 * /random_question: no es el nombre de la tabla. Es simplemente el nombre del endpoint
 *  que defines en tu aplicación Express 
 * para manejar la solicitud de una pregunta aleatoria.
 */

app.get('/random_question', (req, res) => {
  //Selecciona las preguntas al azar que esten en false.
  db.query('SELECT * FROM table_preguntas WHERE usada = FALSE ORDER BY RAND() LIMIT 1', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al obtener pregunta');
    } else {
      if (result.length > 0) {
        //Ingresamos la pregunta obtenida a una lista de un solo objeto
        const pregunta = result[0];
        // Marca la pregunta como usada
        db.query('UPDATE table_preguntas SET usada = TRUE WHERE id_pregunta = ?', [pregunta.id_pregunta], (updateErr) => {
          if (updateErr) {
            console.log(updateErr);
          }
        });
        res.send(pregunta);
      } else {
        res.send({ message: 'No hay más preguntas disponibles' });
      }
    }
  });
});














//------------Reinicios de la BD cada vez que se ingresa al juego-------------------------------------------------------------------------------

//Reinicia la BD preguntas a false.
// Endpoint para resetear las preguntas
app.put('/reset_preguntas', (req, res) => {
  db.query('UPDATE table_preguntas SET usada = FALSE', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error al reiniciar preguntas');
    } else {
      res.send('Todas las preguntas han sido reiniciadas');
    }
  });
});

// Llama al endpoint /reset_preguntas al iniciar el servidor
axios.put('http://localhost:3000/reset_preguntas')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error al reiniciar preguntas:', error);
  });

app.listen(3000,()=>{
  console.log('Corriendo en el puerto 3000')
})
