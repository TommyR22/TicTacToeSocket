// var express = require('express');
// var http = require('http');
// var app = express();
// var server = http.createServer(app);
// var io = require('socket.io').listen(server);

var app = require('express')();
var moment = require('moment');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var client_list = {}; // id - User
var rooms = {}; // nome room, Room

function Room(name, description, timestamp, user) {
    this.name = name;
    this.description = description;
    this.timestamp = timestamp;
    this.user = {
        name: user.name,
        avatar: user.avatar
    },
        this.nclients = 1;
}

function User(name, avatar) {
    this.name = name;
    this.avatar = avatar;
}


// app.get('/', function(req, res){
// res.sendFile(__dirname + '/index.html');
// });

server.listen(3000, function () {
    console.log('Server app listening on port 3000!');
});

function sendToClient(socket, message) {
    socket.emit('sendToClient', {msg: message});
}

io.on('connection', function (socket) {
    console.log('SERVER -> socket connected, id: ' + socket.id);

    // TUTTE le variabili quì dentro si riferiscono al SOCKET corrente.
    var room;  // nome stanza dove si trova il socket
    var clients = []; // lista di User

    // init matrix game tic tac toe
    matrix = new Array(9).fill(0);

    // called before DISCONNECT event
    socket.on('disconnecting', function () {
        console.log('SERVER -> User: ' + client_list[socket.id].name + ' is disconnetting!');
    });
    socket.on('disconnect', function () {
        console.log('SERVER -> User: ' + client_list[socket.id].name + ' disconnected!');
        if (room) {
            clientsInRoom = [];
            if (io.sockets.adapter.rooms[room]) {  // if UNDEFINED -> stanza eliminata
                for (var socketID in io.sockets.adapter.rooms[room].sockets) {
                    clientsInRoom.push(client_list[socketID]);
                }
                socket.to(room).emit('notifyPlayerDisconnected', {
                    oldClient: client_list[socket.id],
                    clients: clientsInRoom
                });
            }
        }
        delete client_list[socket.id];
    });

    /**
     * PLAYER.NEW
     */
    socket.on('player.new', function (data) {
        client_list[socket.id] = data.user;
        console.log('SERVER -> New Player: ', client_list[socket.id].name, ' with id: ', client_list[socket.id].id);
// // or determine whether a key exists
//     key1 in map;
    });


    /**
     * ROOM.NEW
     */
    socket.on('room.new', function (data) {
        var room = new Room(data.room.name, data.room.description, data.room.timestamp, data.room.user);
        rooms[data.room.name] = room;
        console.log('New room created: ', room);
        // rooms.push(room); // local
        // Pushes a new room instance, and join in.
        socket.join(data.room.name, function () {
            room = data.room.name;
            console.log('SERVER -> Client join in his room name: ' + data.room.name);
            // io.to(data.room.name).emit('infoToClients', { msg: 'A new user has joined the room: ' + data.room.user.name }); // broadcast to all clients in the room
            // io.emit('rooms.update_clients', room_list);  // send to ALL client
        });
    });

    socket.on('send', function (data) {
        socket.to(data.room).emit('sendToClient', {msg: data.msg}); // broadcast to all clients in 'game' room except sender
    });


    /**
     * PLAYER.JOIN
     */
    socket.on('player.join', function (data) {
        socket.join(data.room, function () {
            room = data.room;
            clientsInRoom = [];
            console.log('SERVER ->' + 'socket: ' + socket.id + ' joined to room: ' + data.room);
            for (var socketID in io.sockets.adapter.rooms[data.room].sockets) {
                clientsInRoom.push(client_list[socketID]);
            }
            socket.to(data.room).emit('notifyPlayerJoin', {newClient: client_list[socket.id], clients: clientsInRoom});
        });
    });

    socket.on('leave', function (data) {
        socket.leave(data.room, function () {
            clientsInRoom = [];
            console.log('SERVER ->' + 'socket: ' + socket.id + ' left the room: ' + data.room);
            if (io.sockets.adapter.rooms[data.room].sockets) {  // if the last user on the room and exit from it
                for (var socketID in io.sockets.adapter.rooms[data.room].sockets) {
                    clientsInRoom.push(client_list[socketID]);
                }
                io.to(data.room).emit('notifyPlayerLeave', {oldClient: client_list[socket.id], clients: clientsInRoom}); // broadcast to all clients in the room
            } else {
                // nothing
            }
        });
    });

    socket.on('rooms.update', function () {
        console.log('update rooms');
        console.log(io.sockets.adapter.rooms); // ALL rooms
        var rooms_tmp = [];
        for (var item in io.sockets.adapter.rooms) {
            if (rooms[item]) {
                var room = new Room(rooms[item].name, rooms[item].description, rooms[item].timestamp, rooms[item].user);
                room.nclients = io.sockets.adapter.rooms[item].length;
                rooms_tmp.push(room);
            } else {
                delete rooms[item];
            }
        }
        //var clients = io.sockets.adapter.rooms['Room Name'].sockets;
        socket.emit('rooms.update_clients', rooms_tmp);
    });


    socket.on('clients.update', function (data) {
        console.log('update clients');
        clients = [];
        for (var socketID in io.sockets.adapter.rooms[data.room].sockets) {
            clients.push(client_list[socketID]);
        }
        socket.emit('clients.update_clients', clients);
    });

    /**
     * notifica l'inizio del gioco a tutti i clients nella stanza
     */
    socket.on('game.start', function (data) {
        console.log('start game: ', data.room);
        // send message to all client in room
        // TODO bisogna inserire qui la scelta di chi far iniziare per primo e poi quali carte.
        // scegliere tra 0 e 1
        clients = [];   // TODO inserire come globale e togliere ciclo for da send.message
        for (var socketID in io.sockets.adapter.rooms[data.room].sockets) {
            clients.push(client_list[socketID]);
        }

        // send to ALL clients, Seed 1 = X; Seed 2 = O
        io.in(data.room).emit('gameStart', {
            message: 'Game is starting...!',
            data: {
                players: clients,
                turn: clients[0],
                seed1: 1,
                seed2: 2,
                matrix: matrix
            }
        });
    });

    /**
     * manda i comandi al server e all'altro client
     */
    socket.on('send.message', function (data) {
        console.log('sendMessage', data);
        clients = [];
        for (var socketID in io.sockets.adapter.rooms[data.room].sockets) {
            clients.push(client_list[socketID]);
        }
        var userTurn = null;
        if (data.msg.userCurrentTurn.id === clients[0].id) {
            userTurn = clients[1];
        }else {
            userTurn = clients[0];
        }
        if (data.msg.rematch === 'enable') {
            data.msg.matrix = new Array(9).fill(0);
        }
        // send message to all client in the room
        io.in(data.room).emit('send.message.from', {
            matrix: data.msg.matrix,
            turn: userTurn,
            winner: data.msg.winner,
            rematch: data.msg.rematch
        });
    });


});
