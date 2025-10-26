const LancheModel = require('../model/LancheModel');

class LancheController {
    async post(req, res) {  // req = request  e res = response
        const Lanche = new LancheModel(req.body);
        await Lanche
            .save()
            .then(response => {
                return res.status(200).json(response);
            })
            .catch(error => {
                return res.status(500).json(error);
            });
    }


    async getAll(req, res) {
        await LancheModel.find().sort('id')
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }


    async get(req, res) {
        await LancheModel.findOne({ "id": req.params.id })
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async getNextId(req, res) {
        console.log("getNextId");
        let resposta = await LancheModel.findOne().select("id")
                       .sort({ "id": 'descending' }).limit(1);
        let id = 1;
        if (resposta != null)
        {
            console.log(resposta);
            id = Number.parseInt(resposta.id) +1;
        }

        return res.status(200).json(id);
    }


    async update(req, res) {

        await LancheModel.findOneAndUpdate(
                { "id": Number.parseInt(req.params.id) }, 
                req.body, { new: true }
             )
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async delete(req, res) {
        await LancheModel.findOneAndDelete({ "id": req.params.id })
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async marcarEntregue(req, res) {
        await LancheModel.findOneAndUpdate(
                { "id": req.params.id }, 
                { entregue: true }, 
                { new: true }
             )
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

    async getLanchesByData(req, res) {
        const { data } = req.params;
        const dataInicio = new Date(data);
        const dataFim = new Date(dataInicio);
        dataFim.setDate(dataFim.getDate() + 1);

        await LancheModel.find({ 
            dataLiberacao: {
                $gte: dataInicio,
                $lt: dataFim
            }
        }).sort('raAluno')
            .then(response => { return res.status(200).json(response) })
            .catch(error => { return res.status(500).json(error) });
    }

}

module.exports = new LancheController();

