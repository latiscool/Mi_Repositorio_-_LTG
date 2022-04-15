const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = 3000;
const host = 'localhost';
const {
  saveData,
  getData,
  editCancion,
  eliminarCancion,
} = require('./consultas');

const requestListener = async (req, res) => {
  //RUTA RAIZ SERVER
  if (req.url == '/' && req.method === 'GET') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  }

  //RUTA POST - AGREGAR CANCION
  if (req.url == '/cancion' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body = chunk.toString();
      console.log('body req.on data', body);
    });
    req.on('end', async () => {
      const canciones = JSON.parse(body);
      try {
        const respuesta = await saveData(canciones);
        res.end(JSON.stringify(respuesta));
      } catch (error) {
        res.statusCode = 500;
        res.end('Ha ocourrido una falla: ' + error);
      }
    });
  }

  //RUTA GET - VISUALIZAR CANCIONES EN HTML

  if (req.url == '/canciones' && req.method === 'GET') {
    try {
      const mostarCanciones = await getData();
      res.statusCode = 201;
      res.end(JSON.stringify(mostarCanciones));
    } catch (error) {
      res.statusCode = 500;
      res.end('Ha ocurrido una falla ' + error);
    }
  }

  //RUTA PUT - EDITAR CANCIONES

  if (req.url == '/cancion' && req.method === 'PUT') {
    let body = '';
    req.on('data', (chunk) => {
      body = chunk.toString();
    });
    req.on('end', async () => {
      const cancion = JSON.parse(body);
      try {
        const respuesta = await editCancion(cancion);
        res.statusCode = 200;
        res.end(JSON.stringify(respuesta));
      } catch (error) {
        res.statusCode = 500;
        res.end('Ha oucrrido un error: ' + error);
      }
    });
  }

  //RUTA DELETE - ELIMINAR CANCIONES
  if (req.url.startsWith('/cancion') && req.method == 'DELETE') {
    try {
      let { id } = url.parse(req.url, true).query;
      await eliminarCancion(id);
      res.statusCode = 201;
      res.end('Cancion Eliminado');
    } catch (error) {
      res.statusCode = 500;
      res.end('Ha oucrrido un error: ' + error);
    }
  }
  //FIN ()
};

//ARMANDO EL SERVER
const server = http.createServer(requestListener);

//LEVANTANDO EL SERVER
server.listen(PORT, host, () => {
  console.log('Servidor ejecutandose');
});
