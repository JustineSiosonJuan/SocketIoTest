const dotenv = require('dotenv');
const express = require('express');
const socket = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidV4 } = require('uuid');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;
const port = process.env.PORT || PORT;
let thisLog = null;

    app.set('viewport-engine', 'ejs');
    app.use(express.urlencoded({extended : false}));
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use(cookieParser());
    app.use(session({secret: 'logged-in', 
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000000
        }
    }));

    app.get('/', (req, res)=>{
        res.sendFile(path.join('./public/index.html'));
    });

    app.get('/getSocket', (req, res)=>{
        if(thisLog != null){
            res.sendFile(path.join(__dirname + '/public/chat.html'));
        }else{
            res.sendFile(path.join(__dirname + '/public/login.html'));
        }
    });

    app.get('/login', (req, res)=>{
        if(req.session.username){
            res.redirect('/logged');
        }else{
            res.render('login.ejs');
        }
    });

    app.post('/logged', (req, res)=>{
        var regex = /^[A-Za-z0-9 ]+$/;
        req.session.username = req.body.thisName;
        res.redirect('/logged');
    });

    app.get('/logged', (req, res)=>{
        if(req.session.username){
            res.render('chatroom.ejs', {data: req.session.username});
        }else{
            res.redirect('/login');
        }
    });


    let server = app.listen(port, (err)=>{
        if(err) throw err;
        console.log("LISTENING to PORT " + PORT);
    });

    let io = socket(server);


    io.on('connection', (socket)=>{
        socket.on('chat', (data)=>{
            io.sockets.emit('chat', data);
        });

        socket.on('message', (data)=>{
            socket.broadcast.emit('message', data);
        });

        socket.on('endchat', (data)=>{
            socket.broadcast.emit('endchat', data);
        });

        socket.on('join-room', (roomId, userId)=>{
            console.log(roomId + " " + userId);
            socket.join(roomId);
            socket.to(roomId).broadcast.emit('user-connected' ,userId);

            socket.on('disconnect', ()=>{
                socket.to(roomId).broadcast.emit('user-disconnected', userId);
            });

        });


    });


    //VidCall:

    app.get('/vidcall', (req, res)=>{
        res.redirect('/vidcall/' + uuidV4());
    });

    app.get('/vidcall/:room', (req, res)=>{
        res.render('room.ejs', {roomId: req.params.room});
    });


