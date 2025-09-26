const express = require('express');
const router = express.Router();


const {
  writeFileService,
  readFileService,
  appendFileService,
  unlinkFileService,
} = require('../services/file.service');


router.post('/create', async (req, res) => {
  try {
   
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'El campo "content" es requerido.' });
    }
    const result = await writeFileService(content);
    res.status(201).json(result); // 201 = Created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/read', async (req, res) => {
  try {
    const result = await readFileService();
   
    res.status(200).send(result.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'El campo "content" es requerido.' });
    }
    const result = await appendFileService(content);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete('/delete', async (req, res) => {
  try {
    const result = await unlinkFileService();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

//PARA ELIMINARLO DEL TERMINAL: curl -Method DELETE -Uri "http://localhost:3000/file/delete"