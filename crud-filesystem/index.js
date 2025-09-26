const express = require('express');
const fileRoutes = require('./routes/file.routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/file', fileRoutes);

app.get('/', (req, res) => {
  res.send('Servidor CRUD con File System está funcionando!');
});
 
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});