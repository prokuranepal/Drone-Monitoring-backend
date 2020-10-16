module.exports = (io, message, status) => {
    const createDMSEvent = require('../socket/eventfunctions').createDMSEvent;
    let message_object = {
        message:message,
        status:status,
        date: new Date()
    };
    io.to('dms').emit('notifications', message_object);
    createDMSEvent(message_object, "OK", "dms", "x");
}