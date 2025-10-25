const mongoose = require("../config/database");

// 2 - Para informar que um certo aluno pode pegar o lanche, deve-se preencher um formulário com as seguintes opções:

// * Data de liberação do lanche:

// * Código do Aluno (neste caso use uma caixa combo para seleção e liste os registros vindo de outra tabela) (exiba a foto do aluno)

// * Qtde de lanches ( máx. 3)

// * Monte uma tela de consulta onde seja possível informar uma data e então liste todos os alunos autorizados a pegar o lanche.

// * Não deve ser possível fazer 2 registros ou mais na mesma data para o mesmo aluno.

// Deve ser possível alterar e também excluir a autorização.

const LancheSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  dataLiberacao: {
    type: Date,
    required: true,
  },
  raAluno: {
    type: String,
    required: true,
  },
  quantidade: {
    type: Number,
    required: true
  },
});

const Lanche = mongoose.model("Lanche", LancheSchema);

module.exports = Lanche;
