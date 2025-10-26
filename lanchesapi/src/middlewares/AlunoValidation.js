const AlunoModel = require('../model/AlunoModel');

//const AlunoValidation = async(req, res, next)
async function AlunoValidation(req, res, next) {
    console.log("=== DADOS RECEBIDOS NA API ===");
    console.log("RA:", req.body.ra);
    console.log("Nome:", req.body.nome);
    console.log("Foto presente:", !!req.body.foto);
    console.log("Tamanho da foto:", req.body.foto ? req.body.foto.length : 0);
    console.log("Params RA:", req.params.ra);
    console.log("==============================");
    
    const { ra, nome, foto } = req.body;

    let alteracaoRegistro = req.params.ra != null;

    if (!ra && !alteracaoRegistro)
        return res.status(400).json({ erro: 'Informe o RA' });

    if (!foto )
        return res.status(400).json({ erro: 'Informe a foto' });

    if (!nome || nome.length < 2)
        return res.status(400).json({ erro: 'Informe o nome com ao menos 2 dígitos' });

    if (alteracaoRegistro) {
        let qtde = (await AlunoModel.countDocuments({ "ra": req.params.ra }));
        let existe = qtde >= 1;

        if (!existe)
            return res.status(400).json({ erro: 'Não há registro para o ra informado' });
    }
    else {
        if (!ra)
            return res.status(400).json({ erro: 'Informe o ra' });

        let existe = (await AlunoModel.countDocuments({ "ra": ra })) >= 1;
        if (existe)
            return res.status(400).json({ erro: 'Já existe um aluno cadastrado com este ra' });
    }

    return next();
}

module.exports = AlunoValidation;