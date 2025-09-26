const fs = require('fs/promises');
const path = require('path');


const filePath = path.join(__dirname, '..', 'mi_archivo.txt');

/**
 
 * @param {string} content - 
 */
const writeFileService = async (content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true, message: 'Archivo escrito correctamente.' };
  } catch (error) {
    console.error('Error al escribir el archivo:', error);
    throw new Error('No se pudo escribir en el archivo.');
  }
};

/**
 
 */
const readFileService = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return { success: true, data };
  } catch (error) {
    
    if (error.code === 'ENOENT') {
      throw new Error('El archivo no existe.');
    }
    console.error('Error al leer el archivo:', error);
    throw new Error('No se pudo leer el archivo.');
  }
};

/**

 * @param {string} content 
 */
const appendFileService = async (content) => {
  try {
    
    await fs.appendFile(filePath, `\n${content}`, 'utf-8');
    return { success: true, message: 'Contenido añadido correctamente.' };
  } catch (error) {
    console.error('Error al añadir contenido al archivo:', error);
    throw new Error('No se pudo añadir contenido al archivo.');
  }
};


const unlinkFileService = async () => {
  try {
    await fs.unlink(filePath);
    return { success: true, message: 'Archivo eliminado correctamente.' };
  } catch (error) {
    
    if (error.code === 'ENOENT') {
      throw new Error('El archivo que intentas eliminar no existe.');
    }
    console.error('Error al eliminar el archivo:', error);
    throw new Error('No se pudo eliminar el archivo.');
  }
};

module.exports = {
  writeFileService,
  readFileService,
  appendFileService,
  unlinkFileService,
};