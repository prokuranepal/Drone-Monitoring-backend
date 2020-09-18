const {
    request,
    loginWithDefaultUser,
    getMainHospital,
    chai
} = require("./common.test");
let Drone = require('../models/drone');
var should = chai.should();

describe('Drone Request Test', () => {
    let token;
    let hospital_id;
    let drone = {
        droneId: "215",
        name: "spoiler66",
        status: 1,
        type: 1
    };

    before(async () => {
        let hospital = await getMainHospital();
        hospital_id = hospital._id;
        let resToken = await loginWithDefaultUser();
        token = resToken.body.token;
        drone.hospital = hospital_id;
    });

    describe('Request on /drone', function () {

        let drone_data;

        before(async () => {
            drone_data = await Drone(drone).save();
        });


        after(async () => {
            await Drone.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options('/drones')
                .expect(200)
        });

        it('It should GET all the records in the drone with query', () => {
            return request.get('/drones')
                .query({
                    type: 1,
                    status: 1
                })
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should GET all the records in the drone', () => {
            return request.get('/drones')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should PUT all the records in the drone', () => {
            return request.put('/drones')
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('it should  POST drone information', () => {
            const drone_new = {
                droneId: "213",
                name: "hollow94",
                status: 0,
                type: 2,
                hospital: hospital_id
            };
            return request
                .post('/drones')
                .set("Authorization", `Bearer ${token}`)
                .send(drone_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('status');
                    res.body.should.have.property('type');
                });
        });

        it('It should DELETE all the records in the drone', () => {
            return request
                .delete('/drones')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });
        });
    });


    describe('Request on /drone/id', function () {

        let drone_data = null;

        before(async () => {
            drone_data = await Drone(drone).save();
        });

        after(async () => {
            await Drone.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options(`/drones/${drone_data._id}`)
                .expect(200)
        });

        it('it should GET information about drone by the given id', () => {
            return request
                .get(`/drones/${drone_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('status');
                    res.body.should.have.property('type');
                    res.body._id.should.equal(drone_data._id.toString())
                });
        });

        it('it should UPDATE information of drone given the id', () => {
            let drone_update = {
                status: 2
            };
            return request
                .put(`/drones/${drone_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(drone_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.status.should.equal(drone_update.status);
                });

        });

        it('It should do POST request', () => {
            return request.post(`/drones/${drone_data._id}`)
            .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('It should DELETE all the records in the drone according to id', () => {
            return request
                .delete(`/drones/${drone_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });
});