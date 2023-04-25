const express = require('express')
const PORT = process.env.PORT || 8080;
var app = express();
const fs = require('fs')
var main = require('./main');

app.use('/', main);
app.listen(PORT, () => {
    console.log(`Server Run on port ${PORT}`)
});
