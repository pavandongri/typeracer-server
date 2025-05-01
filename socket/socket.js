const socketIo = require('socket.io');

const initSocket = (server) => {
    console.log({initSocketClientUrl:  process.env.FRONTEND_URL})
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }
    });

    global.io = io;

    io.on('connection', (socket) => {
        console.log('Player connected:', socket.id);

        socket.on('joinRaceRoom', ({ raceId, userId }) => {
            socket.join(raceId);
            
            const room = io.sockets.adapter.rooms.get(raceId);

            if (room && room.size >= process.env.MAX_RACE_SIZE) {
                io.to(raceId).emit('raceStarted');
            }
        });

        socket.on('startRace', ({ raceId }) => {
            io.to(raceId).emit('raceStarted');
        });

        socket.on('progress', (data) => {
            socket.to(data.raceId).emit('updateProgress', data);
        });

        socket.on('disconnect', () => {
            console.log('Player disconnected:', socket.id);
        });
    });
};

module.exports = initSocket;
