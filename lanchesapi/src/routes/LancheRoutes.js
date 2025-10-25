const express = require('express');
const router = express.Router();
const LancheController = require('../controller/LancheController');
const LancheValidation = require('../middlewares/LancheValidation');

router.post('/', LancheValidation,  LancheController.post);
router.put('/:id', LancheValidation,  LancheController.update);
router.delete('/:id',  LancheController.delete);
router.get('/getNextId',  LancheController.getNextId);  // ANTES da rota /:id
router.get('/:id',  LancheController.get);
router.get('/',  LancheController.getAll);

module.exports = router;