const mongoose = require('mongoose')

const modelsSchema = require('../middlewares/dataModels')

const DataSchema = mongoose.Schema({
    modelsSchema
    // , models_
    , home: {
        models: {type: Array, default: ["post"]}
    }
    , header: { 
        mainMenu: {type: Array, default: ["Accueil", {}]}
        , logo: {
            img: {type: Array, default: ["/logo912.png", {}]}
            , text: {type: Array, default: ["Je suis un slogan", {}]}
        }
        , logins: {
            login: {type: Array, default: ["Login", {}]}
            , logout: {type: Array, default: ["Logout", {}]}
            , signup: {type: Array, default: ["Signup", {}]}
        }
    }
    , footer: { list: {type: Array, default: [
        {
            titre: ["titre footer 1", {}]
            , items: [["lorem", {}],["lorem", {}],["lorem", {}]]
        }
        , {
            titre: ["titre footer 2", {}]
            , items: [["lorem", {}],["lorem", {}],["lorem", {}]]
        }
        , {
            titre: ["titre footer 3", {}]
            , items: [["lorem", {}],["lorem", {}],["lorem", {}]]
        }
    ]}}
    , jumbotron: {}
})

module.exports = mongoose.model('Data', DataSchema)
/*
const Data = {
    post: Post.schema.paths
    , datas: {
        header: {}
        , footer: {}
    }
}


module.exports = Data
*/