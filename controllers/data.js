
const Data = require('../models/Data')

exports.getOneData = (req, res, next) => {
    res.json({message: "le controlleur pour cette action ('get') n'a pas encore été codé"})
}
exports.getAllData = (req, res, next) => {
/*SNIPPET REQUEST BODY*/
// ner_body
/*SNIPPET MONGOOSE CRUD*/
// necmfind
/*SNIPPET express res*/
res.status(200).json(Data)

}

exports.updatData = (req, res, next) => {
    res.json({message: "le controlleur pour cette action ('update') n'a pas encore été codé"})
}
exports.deleteData = (req, res, next) => {
    res.status(201).json({message: "le controlleur pour cette action ('delete') n'a pas encore été codé"})
}
exports.addData = (req, res, next) => {
    res.json({message: "le controlleur pour cette action ('create') n'a pas encore été codé"})
}
