// server.js
const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const account = require('./koho')
app = express();
app.use(serveStatic(__dirname + "/dist"));
const port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);


app.get('/', (req,res) => {
    console.log('A', account)
    res.end()
    return
})
