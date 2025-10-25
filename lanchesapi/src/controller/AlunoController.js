const { response } = require("express");
const AlunoModel = require("../model/AlunoModel");

class AlunoController {
  async getAll(req, res) {
    await AlunoModel.find()
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async get(req, res) {
    await AlunoModel.findOne({ ra: req.params.ra })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async post(req, res) {
    const aluno = new AlunoModel(req.body);
    await aluno
      .save()
      .then((response) => {
        return res.status(201).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async update(req, res) {
    await AlunoModel.findOneAndUpdate({ ra: req.params.ra }, req.body, {
      new: true,
    })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }

  async delete(req, res) {
    await AlunoModel.findOneAndDelete({ ra: req.params.ra })
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  }
}

module.exports = new AlunoController();
