const LancheModel = require('../model/LancheModel');
const AlunoModel = require('../model/AlunoModel');

// 2 - Para informar que um certo aluno pode pegar o lanche, deve-se preencher um formulário com as seguintes opções:

// * Data de liberação do lanche:

// * Código do Aluno (neste caso use uma caixa combo para seleção e liste os registros vindo de outra tabela) (exiba a foto do aluno)

// * Qtde de lanches ( máx. 3)

// * Monte uma tela de consulta onde seja possível informar uma data e então liste todos os alunos autorizados a pegar o lanche.

// * Não deve ser possível fazer 2 registros ou mais na mesma data para o mesmo aluno.

// Deve ser possível alterar e também excluir a autorização.


async function LancheValidation(req, res, next) {
    console.log(req.body);
    const { id, dataLiberacao, raAluno, quantidade } = req.body;

    let alteracaoRegistro = req.params.id != null;

    if (!dataLiberacao)
        return res.status(400).json({ erro: 'Informe a data de liberação' });

    if (!raAluno)
        return res.status(400).json({ erro: 'Informe o RA do aluno' });

    if (!quantidade || quantidade < 1 || quantidade > 3)
        return res.status(400).json({ erro: 'A quantidade de lanches deve ser entre 1 e 3' });

    // Validar se o RA do aluno existe (chave estrangeira)
    const alunoExiste = await AlunoModel.findOne({ ra: raAluno });
    if (!alunoExiste) {
        return res.status(400).json({ erro: 'Aluno não encontrado com o RA informado' });
    }

    if (alteracaoRegistro) {
        let qtde = (await LancheModel.countDocuments({ "id": req.params.id }));
        let existe = qtde >= 1;

        if (!existe)
            return res.status(400).json({ erro: 'Não há registro para o id informado' });
    }
    else {
        if (!id)
            return res.status(400).json({ erro: 'Informe o id' });

        let existe = (await LancheModel.countDocuments({ "id": id })) >= 1;
        if (existe)
            return res.status(400).json({ erro: 'Já existe um lanche cadastrado com este id' });

        //validar se ja existe autorização para o mesmo aluno na mesma data
        const dataFormatada = new Date(dataLiberacao).toISOString().split('T')[0];
        const existeAutorizacao = await LancheModel.countDocuments({ 
            raAluno: raAluno, 
            dataLiberacao: {
                $gte: new Date(dataFormatada),
                $lt: new Date(new Date(dataFormatada).getTime() + 24 * 60 * 60 * 1000)
            }
        });
        
        if (existeAutorizacao > 0) {
            return res.status(400).json({ erro: 'Já existe uma autorização para este aluno nesta data' });
        }
    }

    return next();
}

module.exports = LancheValidation;
