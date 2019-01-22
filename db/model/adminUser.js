const bcrypt = require('bcrypt');
const confing = require('config');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

const {mongoose} = require('./../mongoose');

const AdminUserSchema = mongoose.Schema({
  userName:{
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

AdminUserSchema.statics.findByCredential = function(userName, password){
  let adminUser = this;

  return adminUser.findOne({
    userName: userName
  }).then((user)=>{

    if (!user){
      user.status(203).send('user not found')
      return Promise.reject('can not find user');
    }

    return new Promise((resolve, reject)=>{
      bcrypt.compare(password, user.password, (res, err)=>{
        if (res){
          return resolve(user);
        }
          return reject('password is wrong');
      });
    });

  },(err)=>{
    return Promise.reject('can not find user');
  });

};

AdminUserSchema.methods.generateAuthToken = function(){

  let adminUser = this;

  let token = jwt.sign({
    _id: adminUser._id
  },confing.get("JSONWEBSECRET"));

  console.log("token:"+token);
  adminUser.tokens.push(token);

  return adminUser.save().then(()=>{
    console.log('token save in DB');
    return token;
  },(err)=>{
    console.log('cant save this token in DB : '+err);
  });

};

AdminUserSchema.pre('save', function (next) {
  let adminUser = this;
  if (adminUser.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(adminUser.password, salt, (err, hash) => {
        adminUser.password = hash;
        next();
      });
    });
  } else {
    next();
  }

});

AdminUserSchema.methods.toJSON = function () {
  let adminUser = this;
  let userObject = adminUser.toObject();

  return _.pick(userObject, ['_id', 'userName', 'tokens']);
};


const AdminUser = mongoose.model('AdminUser',AdminUserSchema,'AdminUser');

module.exports = {
  AdminUser
};
