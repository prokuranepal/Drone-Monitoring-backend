const {
    request,
    loginWithDefaultUser,
    getMainHospital,
    chai
} = require("./common.test");
let DMSEvent = require('../models/event');
var should = chai.should();

describe('dmsevent Request Test', () => {
    let token;
    let hospital_id;
    let dmsevent = {
        eventMessage: "Hello",
        status: "OK",
        to: "DMS",
        from: "drone"
    };

    before(async () => {
        let resToken = await loginWithDefaultUser();
        token = resToken.body.token;
    });

    describe('Request on /dmsevent', function () {

        let dmsevent_data;

        before(async () => {
            dmsevent_data = await DMSEvent(dmsevent).save();
        });


        after(async () => {
            await DMSEvent.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options('/dmsevent')
                .expect(200)
        });

        it('It should GET all the records in the dmsevent', () => {
            return request.get('/dmsevent')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should PUT all the records in the dmsevent', () => {
            return request.put('/dmsevent')
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('it should  POST dmsevent information', () => {
            const dmsevent_new = {
                eventMessage: "Hello",
                status: "KO",
                to: "DMS",
                from: "drone"
            };
            return request
                .post('/dmsevent')
                .set("Authorization", `Bearer ${token}`)
                .send(dmsevent_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('eventMessage');
                    res.body.should.have.property('status');
                    res.body.should.have.property('to');
                });
        });

        it('It should DELETE all the records in the dmsevent', () => {
            return request
                .delete('/dmsevent')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });
        });
    });


    describe('Request on /dmsevent/id', function () {

        let dmsevent_data = null;

        before(async () => {
            dmsevent_data = await DMSEvent(dmsevent).save();
        });

        after(async () => {
            await DMSEvent.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options(`/dmsevent/${dmsevent_data._id}`)
                .expect(200)
        });

        it('it should GET information about dmsevent by the given id', () => {
            return request
                .get(`/dmsevent/${dmsevent_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('eventMessage');
                    res.body.should.have.property('status');
                    res.body.should.have.property('from');
                    res.body._id.should.equal(dmsevent_data._id.toString())
                });
        });

        it('it should UPDATE information of dmsevent given the id', () => {
            let dmsevent_update = {
                status: "KO"
            };
            return request
                .put(`/dmsevent/${dmsevent_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(dmsevent_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.status.should.equal(dmsevent_update.status);
                });

        });

        it('It should do POST request', () => {
            return request.post(`/dmsevent/${dmsevent_data._id}`)
            .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('It should DELETE all the records in the dmsevent according to id', () => {
            return request
                .delete(`/dmsevent/${dmsevent_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });
});