const express = require('express');
const router = express.Router();
const AlunoController = require('../controller/AlunoController');
const AlunoValidation = require('../middlewares/AlunoValidation');

router.post('/', AlunoValidation,  AlunoController.post);
router.put('/:ra', AlunoValidation,  AlunoController.update);
router.delete('/:ra',  AlunoController.delete);
router.get('/:ra',  AlunoController.get);
router.get('/',  AlunoController.getAll);

module.exports = router;