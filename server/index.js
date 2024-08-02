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




app.listen(3000,()=>{
  console.log('Corriendo en el puerto 3000')
})
