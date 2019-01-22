const express = require('express');

const songControl = require('./controller/songControll');
const userControl = require('./controller/userControll');
const adminControl = require('./controller/adminController');

let router = express.Router();

router.post('/addSong',songControl.addSong);
router.get('/getAllsong',songControl.getAllSong);

router.post('/login',userControl.login);
router.post('/register',userControl.register);

router.post('/adminLogin',adminControl.adminLogin)
router.post('/adminRegister',adminControl.adminRegister)

router.delete('/deleteSong',songControl.deleteSong);
router.put('/editsong',songControl.editSong)


module.exports = router;


