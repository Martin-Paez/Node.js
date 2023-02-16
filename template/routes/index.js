var express = require('express');
const cheerio = require('cheerio');
var debug = require('debug')('express:server');
var path = require('path');
const fs = require('fs');
const ss = require('../bin/serveAndSearch');

var router = express.Router();

/* El proyecto es un resumen de tecnologias web, esta compuesto por ejemplos. No se penso
 * para el publico en general.
 * 
 * A su vez, cada ejemplo debe ser independiente del proyecto. O sea que, cada ejemplo es un
 * proyecto en si mismo, por lo tanto, no debe saber que esta formando parte de algo mas grande.
 * 
 * Para que sean legibles las url de los ejemplos y que no sea necesario modificar el lado del
 * servidor cuando se agregan ejemplos, se opto por que las peticiones se resuelvan mediante
 * busquedas recursivas. 
 * 
 */

router.get('/', function(req, res, next) {
  let index = req.app.settings.index;
  let dir = req.app.settings.public;
  ss.searchAndServe(next, dir, index, req, res);
});


/* Para cumplir con la condicion de que los ejemplos deben ser independientes, o sea, proyectos
 * simples en si mismos, la informacion de los js y css que necesitan esta dentro del html de 
 * cada ejemplo particular.
 *
 * Este middleware brinda una solucion del lado del servidor para separa el contenido del head
 * y el body, de forma tal de que el cliente pueda solicitar uno u otro a la hora de actualizar
 * con ajax el contenido de la pagina que contiene al ejemplo.
 * 
 */
router.get('/:any*/:tag(body|head)', function(req, res, next) {
  let first = req.path.split("/")[1];
  if (first === "node_modules")
    next();
  let rute = path.parse(req.path);
  rute = path.parse(rute.dir);
  rute.dir = path.join(req.app.settings.public, rute.dir);
  ss.searchAndServe(next, rute.dir, rute.base, req, res
    , okHandler = (rute, res) => {
        rute = fs.readFile(rute, 'utf8', (err, html) => {
          let $ = cheerio.load(html);
          res.send($(req.params.tag).html());
        });
      }); 
});


/* Resuelve cualquier path de manera recursiva.
 *
 * Salvo que la ruta comience con node_modules, se busca dentro de la carpeta public.
 * 
 * Ejemplo:
 * 
 *    Path : /subfolder/a.html
 * 
 *    Archivo buscado: a.html
 *    Origen de la busqueda: en app.setting.root/public/subfolder
 * 
 * Ejemplo:
 * 
 *    Path : /node_modules/subfolder/events
 * 
 *    Archivo buscado: events.js
 *    Origen de la busqueda: /node_modules/subforlder/events
 * 
 * La raiz del proyecto se encuentra en app.settings.root para desacoplar la ubicacion de este
 * archivo
 * 
 */
router.get('/*', function(req, res, next) {
  let rute = path.parse(req.path);
  let first = rute.dir.split('/')[1];
  if (first === "node_modules")
    rute.dir = path.join(req.app.settings.root, rute.dir);
  else 
    rute.dir = path.join(req.app.settings.public, rute.dir);
  ss.searchAndServe(next, rute.dir, rute.base, req, res); 
});

module.exports = router;
