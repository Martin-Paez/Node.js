var debug = require('debug')('express:server');
var path = require('path');
const fs = require('fs');
const klaw = require('klaw')
const fg = require('fast-glob');

async function pathSearch(query) {
  return (await fg(query))[0];
}

async function streamSearch(query) {
  return await fg.stream(query);
}

function fastGlobSearch(dir, fileName, find = pathSearch) {
  try {
    let query = path.join(path.join(dir, '**'), fileName); 
    forWindows = query.replace(/\\/g, '/');
    return find(forWindows);
  } catch (err) {
    debug(err);
    return null;
  }
}

function klawSearch(dir, fileName) {
  return new Promise((resolve, reject) => {
    const stream = klaw(dir);
    stream.on('data', item => {
      if (path.basename(item.path) === fileName) {
        resolve(item.path);
        stream.destroy();
      }
    });
    stream.on('end', () => resolve(null));
    stream.on('error', error => reject(error));
  });
}

function testSyncSearch(dir, fileName) {
  return new Promise( (resolve) => { resolve(syncSearch(dir, fileName)); });
}

function syncSearch(dir, fileName) {
  let file = null;
  try {   
    fs.readdirSync(dir).forEach(f => {
        let current = path.join(dir, f);
        if (fs.statSync(current).isDirectory()) {
          var f = syncSearch(current, fileName);
          if ( f !== null)
            file = f;
        } else if (f === fileName) {
            file = current; 
            debug(`Encontrado ${file}`);
            return;
        }
    });
  } catch(e) { debug(e) }

  return file;
};

module.exports = {
    pathSearch      : pathSearch,
    streamSearch    : streamSearch,
    fastGlobSearch  : fastGlobSearch,
    klawSearch      : klawSearch,
    syncSearch      : syncSearch
};