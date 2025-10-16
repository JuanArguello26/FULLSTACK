

const http = require('http');
const fs = require('fs/promises'); 
const path = require('path'); 
const EventEmitter = require('events'); 

// --- CONFIGURACIÓN DEL SISTEMA DE LOGS CON EventEmitter ---

class Logger extends EventEmitter {}


const logger = new Logger();


const logFilePath = path.join(__dirname, 'log.txt');


const registrarLog = async (metodo, url) => {
  const fecha = new Date().toISOString();
  const mensajeLog = `[${fecha}] - Metodo: ${metodo} - URL: ${url}\n`;
  
  try {
   
    await fs.appendFile(logFilePath, mensajeLog);
  } catch (error) {
    console.error('Error al escribir en el archivo de logs:', error);
  }
};


logger.on('peticion', registrarLog);


// --- LÓGICA DEL SERVIDOR Y MANEJO DE ARCHIVOS ---


const dataFilePath = path.join(__dirname, 'datos.txt');


const server = http.createServer(async (req, res) => {
  
 
  logger.emit('peticion', req.method, req.url);

 
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    
    switch (pathname) {
      
 
      
      case '/escribir-archivo':
        const contenidoEscribir = url.searchParams.get('contenido');
        if (!contenidoEscribir) {
          res.statusCode = 400; // Bad Request
          res.end('<h1>Error: Falta el parámetro "contenido" en la URL.</h1><p>Ejemplo: /escribir-archivo?contenido=hola</p>');
          return;
        }
        await fs.writeFile(dataFilePath, contenidoEscribir);
        res.statusCode = 201; // Created
        res.end('<h1>Archivo escrito correctamente.</h1>');
        break;

      case '/leer-archivo':
        const data = await fs.readFile(dataFilePath, 'utf-8');
        res.statusCode = 200; 
        res.end(`<h1>Contenido del archivo:</h1><pre>${data}</pre>`);
        break;

      case '/actualizar-archivo':
        const contenidoAnadir = url.searchParams.get('contenido');
        if (!contenidoAnadir) {
            res.statusCode = 400;
            res.end('<h1>Error: Falta el parámetro "contenido" en la URL.</h1><p>Ejemplo: /actualizar-archivo?contenido=mundo</p>');
            return;
        }
        await fs.appendFile(dataFilePath, `\n${contenidoAnadir}`);
        res.statusCode = 200; 
        res.end('<h1>Contenido añadido al archivo.</h1>');
        break;

      case '/borrar-archivo':
        await fs.unlink(dataFilePath);
        res.statusCode = 200; 
        res.end('<h1>Archivo eliminado correctamente.</h1>');
        break;
        
      // --- NUEVA RUTA PARA LEER LOGS ---
      
      case '/leer-log':
        const logData = await fs.readFile(logFilePath, 'utf-8');
        res.statusCode = 200; 
        res.end(`<h1>Contenido del Log:</h1><pre>${logData}</pre>`);
        break;

      case '/':
        res.statusCode = 200; 
        res.end('<h1>Servidor funcionando</h1><p>Usa las rutas para interactuar con los archivos.</p>');
        break;

    
      default:
        res.statusCode = 404; // Not Found
        res.end('<h1>404 - Ruta no encontrada</h1>');
        break;
    }
  } catch (error) {
    
    console.error('Error en la petición:', error);
    res.statusCode = 500; // Internal Server Error
    res.end(`<h1>Error del servidor:</h1><p>${error.message}</p>`);
  }
});


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});