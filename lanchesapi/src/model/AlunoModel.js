const mongoose = require('../config/database');

// 1 - Crie uma tela para CRUD dos alunos. A tela deve solicitar: 

// * RA

// * Nome

// * Foto do aluno

// Obs: todos os campos são obrigatórios

const AlunoSchema = new mongoose.Schema({
  ra: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  foto: {
    type: String,
    required: true
  }
});

const Aluno = mongoose.model('Aluno', AlunoSchema);

module.exports = Aluno;
