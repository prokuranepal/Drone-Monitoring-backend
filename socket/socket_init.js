module.exports = (io) => {
    const app = require('express');
    const router = app.Router();
    // io.on('connection',(socket) => {console.log('Connected to socket');});

    const plane = io.of(/^\/JT\d+/);

    plane.on('connect', (socket) => {
        socket.on('joinPi', () => {
            console.log('aa');
        })
    })

    return router;
}