module.exports = {
    createDMSEvent: (eventMessage, status, to, from) => {
        const DMSEvent = require('../models/event');

        let dmsevent = new DMSEvent({
            eventMessage: eventMessage,
            status: status,
            to: to,
            from: from
        });
        dmsevent.save().catch((err) => {
            return 0;
        });
        return 1;
    }
}