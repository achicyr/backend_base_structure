module.exports = class Util{

    constructor(){

    }

    catchError5 = error => res.status(500).json({ error })
    catchErrorCustom1 = error => res.status(500).json({ error , message: "customize an error message HERE"})
    logListSchemaObject = () => {console.log(User.schema.obj)}
}