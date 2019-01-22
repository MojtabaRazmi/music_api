const _ = require('lodash');

const {AdminUser} = require('./../../db/model/adminUser');


let adminRegister =async function(req, res){

  const body = _.pick(req.body,['userName', 'password']);

  let adminUser = new AdminUser(body);
  adminUser.save().then((user)=>{
    res.status(200).send(user);
  },(err)=>{
    res.status(400);

    if (err.code === 11000){
      res.json({
        statusCode: 400,
        message: 'this user name is exist'
      });
    }else {
      res.json({
        statusCode: 400,
        message: err
      });
    }
  });
};

let adminLogin = async function(req, res){
  let body = _.pick(req.body,['userName','password']);

  try {
    let adminUser = await AdminUser.findByCredential(body.userName, body.password);
    let token = await adminUser.generateAuthToken();
    res.header('x-auth',token).status(200).send(adminUser);

  }catch (e) {
    res.status(400).json({
      statusCode: 400,
      message: 'this account not exist' +e
    });
  }
};

module.exports = {
  adminLogin,
  adminRegister
};