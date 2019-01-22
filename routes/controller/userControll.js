const _ = require('lodash');

const {User} = require('./../../db/model/user');


let register =async function(req, res){

    const body = _.pick(req.body,['email', 'password']);

    let user = new User(body);
    user.save().then((user)=>{
        res.status(200).send(user);
    },(err)=>{
        res.status(400);

        if (err.code === 11000){
            res.json({
                statusCode: 400,
                message: 'this email is exist'
            });
        }else {
            res.json({
                statusCode: 400,
                message: err
            });
        }
    });
};

let login = async function(req, res){
    let body = _.pick(req.body,['email','password']);

    try {
        let user = await User.findByCredential(body.email, body.password);
        let token = await user.generateAuthToken();
        res.header('x-auth',token).status(200).send(user);

    }catch (e) {
        res.status(400).json({
            statusCode: 400,
            message: e
        });
    }
};

module.exports = {
    login,
    register
};