const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const rooms = require('./utils/rooms')

const PORT = process.env.PORT || 3000;

console.log('Server startup console log');

server.listen(PORT, () => {
    console.log('Listening on port: ' + PORT);
})

io.on('connection', socket => {
    
    io.emit('availableRooms', rooms.getAvailableRooms());

    socket.on('create-room', (name, username) => {
        let createRoom = rooms.createRoom(socket.id, name, username);
        if (createRoom == 'username missing') {
            socket.emit('missing-username');
        }
        else if (createRoom == 'error') {
            socket.emit('error-page');
        }
        else {
            socket.join(createRoom.name);
            socket.emit('chat-messages', createRoom.messages);
            socket.emit('room-users', createRoom.users);
            socket.emit('game', createRoom.game);
            socket.emit('created', createRoom.name);
        }
        io.emit('availableRooms', rooms.getAvailableRooms());
    })

    socket.on('join-room', (name, username) => {
        let joinRoom = rooms.joinRoom(socket.id, name, username);
        if (joinRoom == 'username missing') {
            socket.emit('missing-username');
        }
        else if (joinRoom == 'error') {
            socket.emit('error-page');
        }
        else if (joinRoom == 'full') {
            socket.emit('error-page');
        }
        else {
            socket.join(name);
            io.to(name).emit('chat-messages', joinRoom.messages);
            io.to(name).emit('room-users', joinRoom.users);
            if (joinRoom.users.length > 1 && joinRoom.game.winner == '') {
                let startedGame = rooms.startGame(joinRoom.name);
                io.to(name).emit('game', startedGame.game);
            }
            else {
                io.to(name).emit('game', joinRoom.game);
            }
            socket.emit('joined', joinRoom.name);
        }
        io.emit('availableRooms', rooms.getAvailableRooms());
    });

    socket.on('add-message', (message, name) => {
        let room = rooms.addMessage(socket.id, name, message);
        if (room == 'error') {
            console.log('error thrown in socket.on(add-message) (server-side)');
        }
        else {
            io.to(name).emit('chat-messages', room.messages);
        }
    });

    socket.on('move', ({spot, name}) => {
        let room = rooms.move(socket.id, name, spot);
        if (room == 'error') {
            socket.emit('error-page');
        }
        else if (room) {
            if (winner(room.game.board)) {
                rooms.stopGame(room.name);
                let winningPlayer = room.game.currentPlayer == 'X' ? 'O' : 'X';
                rooms.setWinner(room.name, winningPlayer);
            }
            io.to(name).emit('game', room.game);
        }
    });

    socket.on('leave-room', name => {
        socket.leave(name);
        let leaveRoom = rooms.leaveRoom(socket.id, name);
        if (leaveRoom == 'error') {
            socket.emit('error-page');
        }
        else {
            io.to(name).emit('chat-messages', leaveRoom.messages);
            io.to(name).emit('room-users', leaveRoom.users);
            let stoppedGame = rooms.stopGame(name);
            io.to(name).emit('game', stoppedGame.game);
        }
        rooms.removeEmptyRooms();
        io.emit('availableRooms', rooms.getAvailableRooms());
    });

    socket.on('disconnect', () => {
        let roomName = rooms.getRoomName(socket.id);
        socket.leave(roomName);
        let leaveRoom = rooms.leaveRoom(socket.id, roomName);
        if (leaveRoom == 'error') {
            socket.emit('error-page');
        }
        else {
            io.to(roomName).emit('chat-messages', leaveRoom.messages);
            io.to(roomName).emit('room-users', leaveRoom.users);
            let stoppedGame = rooms.stopGame(roomName);
            io.to(roomName).emit('game', stoppedGame.game);
        }
        rooms.removeEmptyRooms();
        io.emit('availableRooms', rooms.getAvailableRooms());
    });
});

function winner(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}