const {
    request,
    loginWithDefaultUser,
    getMainHospital,
    chai
} = require("./common.test");
let Mission = require('../models/mission');
let HealthPost = require('../models/healthFacilities');
var should = chai.should();

describe('Mission Request Test', () => {
    let token;
    let hospital_id;
    let healthpost_id;
    let mission = {
        name: "Test 1",
        radius: 10,
        speed: 5,
        waypoints: [],
        wb: 0
    };
    let healthPost = {
        name: "kathmandu pharma",
        location: "xyz",
        gps_location: {
            coordinates: ['45.22', '342.324']
        },
        type: 'healthpost'
    };


    before(async () => {
        let hospital = await getMainHospital();
        hospital_id = hospital._id;
        let resToken = await loginWithDefaultUser();
        healthPost.hospital = hospital_id;
        let healthpost_data = await HealthPost(healthPost).save();
        healthpost_id = healthpost_data._id;
        token = resToken.body.token;
        mission.hospital = hospital_id;
        mission.destination = healthpost_id;
    });

    describe('Request on /mission', function () {

        let mission_data;

        before(async () => {
            mission_data = await Mission(mission).save();
        });


        after(async () => {
            await Mission.collection.drop();
            await HealthPost.remove({type:'healthpost'});
        });

        it('It should do OPTIONS request', () => {
            return request.options('/mission')
                .expect(200)
        });

        it('It should GET all the records in the drone', () => {
            return request.get('/mission')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should PUT all the records in the drone', () => {
            return request.put('/mission')
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('it should  POST mission information', () => {
            const mission_new = {
                name: "Test 1",
                radius: 10,
                speed: 5,
                waypoints: [],
                wb: 0,
                hospital: hospital_id,
                destination: healthpost_id
            };
            return request
                .post('/mission')
                .set("Authorization", `Bearer ${token}`)
                .send(mission_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('radius');
                    res.body.should.have.property('speed');
                });
        });

        it('It should DELETE all the records in the mission', () => {
            return request
                .delete('/mission')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });
        });
    });


    describe('Request on /mission/id', function () {

        let mission_data = null;

        before(async () => {
            mission_data = await Mission(mission).save();
        });

        after(async () => {
            await Mission.collection.drop();
            await HealthPost.remove({type:'healthpost'});
        });

        it('It should do OPTIONS request', () => {
            return request.options(`/mission/${mission_data._id}`)
                .expect(200)
        });

        it('it should GET information about mission by the given id', () => {
            return request
                .get(`/mission/${mission_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('status');
                    res.body.should.have.property('radius');
                    res.body._id.should.equal(mission_data._id.toString())
                });
        });

        it('it should UPDATE information of mission given the id', () => {
            let mission_update = {
                status: 'completed'
            };
            return request
                .put(`/mission/${mission_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(mission_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.status.should.equal(mission_update.status);
                });

        });

        it('It should do POST request', () => {
            return request.post(`/mission/${mission_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('It should DELETE all the records in the mission according to id', () => {
            return request
                .delete(`/mission/${mission_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });
});