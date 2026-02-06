const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Game state management
const rooms = new Map();
const playerColors = [
    [1.0, 0.3, 0.3], // Red
    [0.3, 1.0, 0.3], // Green
    [0.3, 0.3, 1.0], // Blue
    [1.0, 1.0, 0.3], // Yellow
    [1.0, 0.3, 1.0], // Magenta
    [0.3, 1.0, 1.0], // Cyan
    [1.0, 0.6, 0.3], // Orange
    [0.6, 0.3, 1.0]  // Purple
];

class Room {
    constructor(id, hostName, hostId) {
        this.id = id;
        this.players = new Map();
        this.currentLevel = 0;
        this.mapSeed = Math.random();
        this.terminalPositions = [];
        this.exitPosition = null;
        this.completedCodes = new Set();
        this.maxPlayers = 8;
        this.createdAt = Date.now();
        
        // Add host as first player
        this.addPlayer(hostId, hostName);
    }

    addPlayer(socketId, playerName) {
        const colorIndex = this.players.size % playerColors.length;
        const player = {
            id: socketId,
            name: playerName,
            color: playerColors[colorIndex],
            position: [5.5, 1.7, 5.5],
            yaw: 0,
            pitch: 0,
            light: 0,
            dead: false
        };
        this.players.set(socketId, player);
        return player;
    }

    removePlayer(socketId) {
        this.players.delete(socketId);
    }

    updatePlayer(socketId, data) {
        const player = this.players.get(socketId);
        if (player) {
            Object.assign(player, data);
        }
    }

    getPlayerData() {
        return Array.from(this.players.values());
    }

    isEmpty() {
        return this.players.size === 0;
    }

    completeCode(code) {
        this.completedCodes.add(code);
        return this.completedCodes.size;
    }

    levelUp() {
        if (this.currentLevel < 2) {
            this.currentLevel++;
            this.completedCodes.clear();
            this.mapSeed = Math.random();
            return true;
        }
        return false;
    }

    reset() {
        this.completedCodes.clear();
        this.players.forEach(p => {
            p.position = [5.5, 1.7, 5.5];
            p.dead = false;
        });
    }
}

// Generate unique room code
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    do {
        code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
    } while (rooms.has(code));
    return code;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    let currentRoom = null;
    let playerName = null;

    // Create a new room
    socket.on('createRoom', (name) => {
        playerName = name || 'Player';
        const roomCode = generateRoomCode();
        const room = new Room(roomCode, playerName, socket.id);
        rooms.set(roomCode, room);
        currentRoom = roomCode;
        
        socket.join(roomCode);
        
        socket.emit('roomCreated', {
            roomCode: roomCode,
            player: room.players.get(socket.id),
            room: {
                currentLevel: room.currentLevel,
                mapSeed: room.mapSeed,
                players: room.getPlayerData()
            }
        });
        
        console.log(`Room ${roomCode} created by ${playerName}`);
    });

    // Join existing room
    socket.on('joinRoom', (data) => {
        const { roomCode, name } = data;
        playerName = name || 'Player';
        const room = rooms.get(roomCode);
        
        if (!room) {
            socket.emit('error', { message: 'Room not found' });
            return;
        }
        
        if (room.players.size >= room.maxPlayers) {
            socket.emit('error', { message: 'Room is full' });
            return;
        }
        
        currentRoom = roomCode;
        const player = room.addPlayer(socket.id, playerName);
        socket.join(roomCode);
        
        // Send room data to new player
        socket.emit('roomJoined', {
            roomCode: roomCode,
            player: player,
            room: {
                currentLevel: room.currentLevel,
                mapSeed: room.mapSeed,
                players: room.getPlayerData(),
                completedCodes: Array.from(room.completedCodes)
            }
        });
        
        // Notify other players
        socket.to(roomCode).emit('playerJoined', player);
        
        console.log(`${playerName} joined room ${roomCode}`);
    });

    // Player movement update
    socket.on('playerUpdate', (data) => {
        if (!currentRoom) return;
        
        const room = rooms.get(currentRoom);
        if (!room) return;
        
        room.updatePlayer(socket.id, data);
        
        // Broadcast to other players in room
        socket.to(currentRoom).emit('playerMoved', {
            id: socket.id,
            ...data
        });
    });

    // Terminal interaction
    socket.on('terminalActivated', (terminalIndex) => {
        if (!currentRoom) return;
        
        const room = rooms.get(currentRoom);
        if (!room) return;
        
        const codesCollected = room.completeCode(terminalIndex);
        
        // Notify all players in room
        io.to(currentRoom).emit('codeCollected', {
            playerId: socket.id,
            playerName: playerName,
            terminalIndex: terminalIndex,
            totalCodes: codesCollected
        });
        
        console.log(`Terminal ${terminalIndex} activated in room ${currentRoom}. Codes: ${codesCollected}/3`);
    });

    // Exit activated (level complete)
    socket.on('exitActivated', () => {
        if (!currentRoom) return;
        
        const room = rooms.get(currentRoom);
        if (!room) return;
        
        if (room.completedCodes.size === 3) {
            if (room.levelUp()) {
                // Move to next level
                room.reset();
                io.to(currentRoom).emit('levelComplete', {
                    newLevel: room.currentLevel,
                    mapSeed: room.mapSeed
                });
                console.log(`Room ${currentRoom} advanced to level ${room.currentLevel}`);
            } else {
                // Game complete
                io.to(currentRoom).emit('gameComplete');
                console.log(`Room ${currentRoom} completed the game!`);
            }
        }
    });

    // Player death
    socket.on('playerDied', () => {
        if (!currentRoom) return;
        
        const room = rooms.get(currentRoom);
        if (!room) return;
        
        const player = room.players.get(socket.id);
        if (player) {
            player.dead = true;
            io.to(currentRoom).emit('playerDead', {
                id: socket.id,
                name: playerName
            });
        }
    });

    // Chat message
    socket.on('chatMessage', (message) => {
        if (!currentRoom) return;
        
        io.to(currentRoom).emit('chatMessage', {
            playerId: socket.id,
            playerName: playerName,
            message: message,
            timestamp: Date.now()
        });
    });

    // Get room list
    socket.on('getRoomList', () => {
        const roomList = Array.from(rooms.values())
            .filter(room => room.players.size < room.maxPlayers)
            .map(room => ({
                code: room.id,
                players: room.players.size,
                maxPlayers: room.maxPlayers,
                level: room.currentLevel
            }));
        
        socket.emit('roomList', roomList);
    });

    // Disconnect
    socket.on('disconnect', () => {
        if (currentRoom) {
            const room = rooms.get(currentRoom);
            if (room) {
                room.removePlayer(socket.id);
                
                // Notify other players
                socket.to(currentRoom).emit('playerLeft', {
                    id: socket.id,
                    name: playerName
                });
                
                // Delete room if empty
                if (room.isEmpty()) {
                    rooms.delete(currentRoom);
                    console.log(`Room ${currentRoom} deleted (empty)`);
                }
            }
        }
        console.log(`Player disconnected: ${socket.id}`);
    });
});

// Clean up old empty rooms periodically
setInterval(() => {
    const now = Date.now();
    for (const [code, room] of rooms.entries()) {
        if (room.isEmpty() && (now - room.createdAt) > 3600000) { // 1 hour
            rooms.delete(code);
            console.log(`Cleaned up old room: ${code}`);
        }
    }
}, 300000); // Every 5 minutes

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
