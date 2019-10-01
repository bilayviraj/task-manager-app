const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/task-manager-app'));

app.get('/*',  (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/task-manager-app/index.html'));
});


app.listen(process.env.PORT || 8080);


