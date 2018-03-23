const express = require('express');
var mysql = require('mysql');
var utilities = require('mysql-utilities');
var ws = require('ws');


var app = express();
app.listen(3131);

app.get('/', function(req, res){

    res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=UTF-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
    });
     let data = [];
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'vlad1996',
        database: 'chat'
    });
    connection.query('SELECT username, message, date FROM users', function (err, res) {
        let i=0;
while (res[i])
{
    data[i] = res[i];
    console.log(data[i]);
    i++;
}

    });

    setTimeout(function () {
        let qdata = JSON.stringify(data);
        res.end(qdata);
    },200);

});

const server = new ws.Server({
    port: 8081
});

var clients = {};


server.on('connection', function(ws) {

    var id = Math.random()*100;
    clients[id] = ws;
    console.log("новое соединение " + id);



    ws.on('message', function(message) {
       // console.log('получено сообщение ' + message);

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'vlad1996',
            database: 'chat'
        });
        connection.connect();
        utilities.upgrade(connection);
        utilities.introspection(connection);

        if (connection) {
            let data = JSON.parse(message);



            connection.insert('users', {
                username: data.username,
                message: data.message,
                date: data.time
            }, function (err, recordId) {
                console.log({insert: recordId});
            });
        }

        connection.close;

        for (var key in clients) {
            clients[key].send(message);
        }
    });

    ws.on('close', function() {
       // console.log('соединение закрыто ' + id);
        delete clients[id];
    });

});



