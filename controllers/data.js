
const Data = require('../models/Data')

exports.getAll = (req, res, next) => {
    /*SNIPPET REQUEST BODY*/
    // ner_body
    /*SNIPPET MONGOOSE CRUD*/
    // necmfind
    /*SNIPPET express res*/
    res.status(200).json(Data)
    
}

