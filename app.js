const express = require('express')
, mongoose = require('mongoose')
, path = require('path')

// const draftRoutes = require('./routes/draft')
const auth = require('./middlewares/auth')
, userRoutes = require('./routes/user')
, Post = require('./models/Post')
, Product = require('./models/Product')
, Data = require('./models/Data')
, pageModels = {post: Post, product: Product}

// , modelsDatas = require('./middlewares/dataModelsDatas.js')


const app = express()
mongoose.connect('mongodb+srv://archist:1&Bigcyri@cluster0.61na4.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

//analyser le corps de la requête
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

console.log(new Post());
console.log(Post.schema.obj);
console.log(JSON.stringify(Post.schema.paths.userId));
// console.log(JSON.stringify(Post));
// for(let a in Post)console.log(a);

app.get('/post', (req,res,next) => {res.status(200).json(Post.schema.paths)})
app.get('/newPost', (req,res,next) => {
    console.log(req.body);
    const a = {
        userId: "62f4e7c77b548cab86aa6344",
        titre: "fdsjoisdjfdsiojiofd joi",
        imageUrl: "/image.ok.jpg",
        contenu: "hudsif hids hoids joidsjofds joi jfdsoijfds Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam autem, possimus et cupiditate voluptatem delectus tempore laudantium asperiores corrupti, voluptatibus nihil explicabo nulla vel similique esse, quae deleniti eligendi debitis.",
        creationDate: +new Date(),
    }
    , post = new Post(a)
    post.save().then(e=>{
        res.status(201).json({post:"créé"})
    })
})
app.get('/api/data'/*, auth*/, async (req,res,next) => {
    console.log("kkkkkkkkkkkkk");
    
    const datas = await new Promise((res,rej)=>{
        Data.find().then((datas) => {
            res(datas.pop())
        })
        .catch(error=>{res.status(400).json({error: "oo"})})
    })
    // console.log(datas);
    // console.log(datas.models);
    console.log("datas");
    const modelsExtracted = {}
    for(let modelName in datas.modelsSchema)if(datas.modelsSchema.hasOwnProperty(modelName)){
        console.log(3,modelName);
        modelsExtracted[modelName] = []
        modelsExtracted[modelName].push(
            await new Promise((res,rej)=>{
                pageModels[modelName].find().then((model) => {
                    res(model)
                })
            })
        )
        modelsExtracted[modelName] = [...modelsExtracted[modelName][0]]
    }
    console.log("🚀modelsExtracted:: ~ file: app.js ~ line 58 ~ app.get ~ modelsExtracted", modelsExtracted)
    res.status(200).json(
        {...datas._doc, modelsDatas: modelsExtracted}
        // {ok:"ok"}
    )
   /*
    Data.find().then((datas) => {
        console.log(modelsDatas);
        new Promise((resolve, reject) => {
            const obj = {}
            datas = datas.pop()
            console.log(datas.models)
            Object.keys(datas.models).forEach((item) => {
                obj[item] = modelsDatas[item].find()
                    .then(
                        posts => posts
                    ).catch(
                        error => error
                    )
            })
            resolve(obj)
        }).then((resultat)=>{

            console.log(resultat);
            res.status(200).json(
                {...datas._doc, modelsDatas: resultat}
            )
        })
    }
    ).catch(error=>{res.status(400).json({error: "oo"})})
    */

})
app.get('/api/newData'/*, auth*/, (req,res,next) => {
    const data = new Data()
    data.save()
        .then(()=>{res.status(200).json({message: "data created"})})
})
app.use('/api/auth', userRoutes)
// app.use('/api/draft', dataRoutes)
// app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
