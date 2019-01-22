const confing = require('config');
const bcrypt = require('bcrypt')
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const {mongoose} = require('./../mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 6
    },
    tokens: [{
        type: String
    }]
});

userSchema.statics.findByCredential = function(email, password){
    let user = this;

    return user.findOne({
        email: email
    }).then((user)=>{

        if (!user){
            return Promise.reject('can not find user');
        }

        return new Promise((resolve, reject)=>{
           bcrypt.compare(password, user.password, (err, res)=>{
               if (res){
                   return resolve(user);
               } else {
                   return reject('password is wrong');
               }
           });
        });

    },(err)=>{
        return Promise.reject('can not find user');
    });

};

userSchema.methods.generateAuthToken = function(){

    let user = this;

    let token = jwt.sign({
        _id: user._id
    },confing.get("JSONWEBSECRET"));

    console.log("token:"+token);
    user.tokens.push(token);

    return user.save().then(()=>{
        console.log('token save in DB');
        return token;
    },(err)=>{
        console.log('cant save this token in DB');
    });

};

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'tokens']);
};


const User = mongoose.model('User',userSchema,'User');

module.exports = {
    User
};
