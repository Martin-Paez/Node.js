const express = require('express');
const app = express();

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: '192.168.0.6',
  user: 'root',
  password: '1234',
  database: 'iot'
});

app.get('/sql/iot/ldr', (req, res) => {
  connection.query('SELECT * FROM ldr', (error, results) => {
    if (error) {
      console.error(error);
      res.send(error);
    } else {
      res.send(results);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

/* 
En teoria esto, si es app de escritorio, el acceso  
a los links me conviene manejarlo con js y html. 
Pero si lo hago desde el servidor, seria mas facil
llevarlo a la web.

app.get('/link', (req, res) => {
  res.send('<div>Hello from the server!</div>');
});

app.get('/boton', (req, res) => {
    res.sendFile(__dirname + '\\front\\pag.html');
});
*/