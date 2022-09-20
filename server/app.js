// import path
const path = require('path');
// import Express
const express = require('express');
// HTTP port
const port = 3000;
// app object
const app = express();
// import body parser
const bodyParser = require('body-parser');
// import uuid
const { v4 } = require('uuid');
// import fs
const fs = require('fs');

// add routes
const route = require('./routes/route');

// path to static content
const staticPath = path.resolve(__dirname, '..', 'client', 'docs');
// data path
const usersData = path.resolve(__dirname, 'data', 'users.json');

// set programm to use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// add express static path
app.use(express.static(staticPath));
// add express json
app.use(express.json())


// request to base url
app.get('/', (req, res) => {
    res.sendFile(staticPath);
});

app.post('/user/create', (req, res) => {
    const reqBody = { ...req.body };
    const user = { body: reqBody, id: v4() };
    const data = JSON.parse(fs.readFileSync(usersData));
    let create = true;
    for (let i = 0; i < data.length; i++) {
        if (JSON.stringify(data[i].body) === JSON.stringify(reqBody)) {
            res.status(501).json('User alredy create');
            create = false;
            break;
        }
    }
    if (create) {
        data.push(user);
        fs.writeFileSync(usersData, JSON.stringify(data));
        res.status(200).json('ok');
    }

});

// start server
const server = app.listen(port, error => {
    if (error) return console.log(error);
    console.log(`Server listening on port ${server.address().port}`);
});