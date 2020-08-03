var rooms = [];

/*
rooms [
    name,
    messages: [
        {
            username,
            message
        }
    ],
    users: [
        {
            socketid,
            username,
            player
        }
    ],
    game: {
        board,
        player,
        playing,
        winner
    }
]
*/

const botName = 'TicTacBot';

function getRoomIndex(name) {
    return rooms.findIndex(room => room.name == name);
}

function usernameNotOkay(username) {
    return (username == null || username == '');
}

function createRoom(socketid, name, username) {
    if (usernameNotOkay(username)) {
        return 'username missing';
    }
    let createRoom = {
        name,
        messages: [
            {
                username: botName,
                message: 'Welcome to ' + name
            }
        ],
        users: [
            {
                socketid,
                username,
                player: 'X'
            }
        ],
        game: {
            board: ['', '', '', '', '', '', '', '', ''],
            currentPlayer: 'X',
            playing: false,
            winner: ''
        }
    };

    if (getRoomIndex(name) === -1) {
        rooms.push(createRoom);
        return createRoom;
    }
    else {
        return 'error';
    }
}

function joinRoom(socketid, name, username) {
    if (usernameNotOkay(username)) {
        return 'username missing';
    }
    else {
        let joinRoom = getRoomIndex(name);
        if (joinRoom !== -1) {
            if (rooms[joinRoom].users.length > 1) {
                return 'full';
            }
            else {
                let otherPlayer = rooms[joinRoom].users[0].player;
                let joinUser = { socketid, username };
                if (otherPlayer == 'X') {
                    joinUser.player = 'O';
                }
                else {
                    joinUser.player = 'X';
                }
                let joinMessage = { username: botName, message: username + ' has joined the room.' };
                rooms[joinRoom].users.push(joinUser);
                rooms[joinRoom].messages.push(joinMessage);
                return rooms[joinRoom];
            }
        }
        else {
            return 'error';
        }
    }
}

function leaveRoom(socketid, name) {
    let leaveRoom = getRoomIndex(name);
    if (leaveRoom !== -1) {
        let leaver = rooms[leaveRoom].users.find(user => user.socketid == socketid);
        let leaveMessage = { username: botName, message: leaver.username + ' has left the room.' };
        rooms[leaveRoom].users = rooms[leaveRoom].users.filter(user => user.socketid != leaver.socketid);
        rooms[leaveRoom].messages.push(leaveMessage);
        return rooms[leaveRoom];
    }
    else {
        return 'error';
    }
}

function addMessage(socketid, name, message) {
    let room = getRoomIndex(name);
    if (room !== -1) {
        let sender = rooms[room].users.find(user => user.socketid == socketid);
        let newMessage = { username: sender.username, message };
        rooms[room].messages.push(newMessage);
        return rooms[room];
    }
    else {
        return 'error';
    }
}

function move(socketid, name, spot) {
    let room = getRoomIndex(name);
    if (room !== -1) {
        if (rooms[room].game.playing && rooms[room].game.winner == '') {
            let player = rooms[room].users.find(user => user.socketid == socketid).player;
            if (rooms[room].game.board[spot] == '') {
                rooms[room].game.board[spot] = player;
            }
            else {
                return;
            }
            if (player == 'X') {
                rooms[room].game.currentPlayer = 'O';
            }
            else {
                rooms[room].game.currentPlayer = 'X';
            }
            return rooms[room];
        }
    }
    else {
        return 'error';
    }
}

function startGame(name) {
    let room = getRoomIndex(name);
    if (room !== -1) {
        rooms[room].game.playing = true;
        return rooms[room];
    }
}

function stopGame(name) {
    let room = getRoomIndex(name);
    if (room !== -1) {
        rooms[room].game.playing = false;
        return rooms[room];
    }
}

function setWinner(name, winner) {
    let room = getRoomIndex(name);
    if (room !== -1) {
        rooms[room].game.winner = winner;
        return rooms[room];
    }
}

function getRoomName(socketid) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].users.find(user => user.socketid == socketid)) {
            return rooms[i].name;
        }
    }
}

function removeEmptyRooms() {
    rooms = rooms.filter(room => room.users.length > 0);
}

function getAvailableRooms() {
    return rooms.filter(room => room.users.length == 1);
}

// Bliver ikke brugt i øjeblikket, men meget smart funktion.
function removeDisconnectedUser(socketid) {
    rooms.forEach(room => {
        room.users = room.users.filter(user => user.socketid != socketid);
    });
}

module.exports = {
    createRoom,
    joinRoom,
    leaveRoom,
    addMessage,
    move,
    getRoomName,
    removeEmptyRooms,
    startGame,
    stopGame,
    setWinner,
    getAvailableRooms
};