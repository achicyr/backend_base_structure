const bcrypt = require('bcrypt')
, jwt = require('jsonwebtoken')
, User = require('../models/User')

, Utils = require('../middlewares/Utils.class')
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                password: hash,
                role: 0,
            })
            user.save()
                .then((reponse) =>{
                    console.log('Utilisateur créé !')
                    return res.status(201).json({ 
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                        , ...reponse
                        , message: 'Utilisateur créé !'
                    })
                })
                .catch(_.catchError5)
        })
        .catch(_.catchError5)
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.login = (req, res, next) => {
    User.findOne({ username: req.body.username || "" })
        .then(user => {
            console.log(user)
            if (!user) {
                console.log('Utilisateur non identifié')
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    console.log('Utilisateur identifié')
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
                    }
                    res.status(200).json({
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                        // userId: user._id,
                        // ,liked: user.liked
                        // , role: user.role
                        , ...user
                    })
                })
                .catch(_.catchError5)
        })
        .catch(_.catchError5)
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.logout = (req, res, next) => {
    console.log("ICI ON POURRAIT ENREGISTRER DANS LES DONNÉES DE L'UTILISATEUR SES DATES ET HEURES DE CONNEXION PAR EXEMPLE.")
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

exports.updateRole = (req, res, next) => {
    
    User.findOne({username: req.params.id})
        .then((user) => {
            // console.log(user)
            // console.log(req.body)
            // console.log(req.params.id)
            // user.role = req.params.value
            User.updateOne({_id:user._id},{role:2})
                .then((response) => {
                    return res.status(201).json({message: "le role vip a été rajouté à "+req.params.id})
                })
                .catch(_.catchError5)
        })
        .catch(_.catchError5)
}

/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */
/************************************************************************************************************ */

