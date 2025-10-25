const AlunoModel = require('../model/AlunoModel');

//const AlunoValidation = async(req, res, next)
async function AlunoValidation(req, res, next) {
    console.log(req.body);
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
            return res.status(400).json({ erro: 'Já existe uma pessoa cadastrada com este ra' });
    }

    return next();
}

module.exports = AlunoValidation;