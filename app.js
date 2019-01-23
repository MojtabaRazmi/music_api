const config = require('config');
const express = require('express');
const path = require('path');

const routes = require('./routes/route');

const app = express();
app.use(express.json());
let pa = path.join(__dirname,'public');

app.use('/public',express.static(pa));
app.use('/api',routes);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build' , 'index.html'));
});

app.listen(config.get('PORT'),()=>{
    console.log('app run on port:'+config.get('PORT'));
})


