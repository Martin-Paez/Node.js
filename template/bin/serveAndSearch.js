var debug = require('debug')('express:server');
const _ = require('./fileSearch.js');

function searchAndServe(next, dir, fileName, req, res, okHandler = sendFile,
                        errHandler = err, searchMode = _.pathSearch, ... args ) {

    _.fastGlobSearch(dir, fileName, searchMode)
    .then( rute => {
        if (rute)
            okHandler(rute, res, ...args);
        else {
            let msg = `No se encontro el archivo`;
            errHandler(next, msg, "", req.path, dir, fileName, rute, ...args);
    }
    })
    .catch( error => {
        let msg = `Se produjo un error al buscar el archivo: error`;
        errHandler(next, msg, error, req.path, dir, fileName, null, ...args);
    });

}

function sendFile(filePath, res) {
    res.sendFile(filePath);
}

function err(next, customMsg, errMsg, reqPath, searchOrigin, inFileName, outFileName) {
    debug(`***********************************************\n ` +
        `Path recibido        : "${reqPath}"            \n ` +
        `Archivo interpretado : "${inFileName}"         \n ` +
        `Origen de la busqueda: "${searchOrigin}"       \n ` +
        `Archivo encontrado   : "${outFileName}"        \n ` +
        `***********************************************   ` );
    next(new Error(customMsg + errMsg));
}

function ignoreErr(next, ...args) {
    next();
}

function testSyncSearch(dir, fileName) {
    return new Promise( (resolve) => { resolve(_.syncSearch(dir, fileName)); });
}


module.exports = {
    testSyncSearch  : testSyncSearch,
    sendFile        : sendFile,
    searchAndServe  : searchAndServe,
    err             : err,
    ignoreErr       : ignoreErr
}