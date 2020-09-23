const {
    request,
    loginWithDefaultUser,
    getMainHospital,
    chai
} = require("./common.test");
let HealthPost = require('../models/healthFacilities');
var should = chai.should();

describe('Healthpost', () => {
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
        token = resToken.body.token;
        healthPost.hospital = hospital_id;
    });

    describe('Request on /healthpost', function () {

        let healthpost_data = null;

        before(async () => {
            healthpost_data = await HealthPost(healthPost).save();
        });

        after(async () => {
            await HealthPost.remove({
                type: 'healthpost'
            });
        });

        it('It should do OPTIONS request', () => {
            return request.options('/healthpost')
                .expect(200)
        });

        it('It should GET all the records in the healthpost', () => {
            return request
                .get('/healthpost')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('it should  POST healthpost information', () => {
            const healthpost_new = {
                name: "Baidhya healthpost",
                location: 'xyz',
                gps_location: {
                    coordinates: ['45.22', '342.324']
                },
                hospital: hospital_id
            };
            return request
                .post('/healthpost')
                .set("Authorization", `Bearer ${token}`)
                .send(healthpost_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('location');
                    res.body.should.have.property('employee');
                    res.body.should.have.property('medicine');
                    res.body.should.have.property('gps_location');
                });
        });

        it('It should DELETE all the records in the healthpost', () => {
            return request
                .delete('/healthpost')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.status.should.equal('OK');
                    res.body.msg.should.equal('Successfully Deleted');
                });
        });
    });


    describe('Request on /healthpost/id', function () {

        let healthpost_data = null;

        before(async () => {
            healthpost_data = await HealthPost(healthPost).save();
        });

        after(async () => {
            await HealthPost.remove({
                type: 'healtpost'
            });
        });

        it('It should do OPTIONS request', () => {
            return request.options(`/healthpost/${healthpost_data._id}`)
                .expect(200)
        });


        it('it should GET information about healthpost by the given id', () => {
            return request
                .get(`/healthpost/${healthpost_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('location');
                    res.body.should.have.property('employee');
                    res.body.should.have.property('medicine');
                    res.body.should.have.property('gps_location');
                    res.body._id.should.equal(healthpost_data._id.toString());
                });
        });

        it('it should UPDATE information of healthpost given the id', () => {
            let healthpost_update = {
                location: 'Bhaktapur'
            };
            return request
                .put(`/healthpost/${healthpost_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(healthpost_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.location.should.equal(healthpost_update.location);
                });

        });

        it('It should DELETE all the records in the healthpost according to id', () => {
            return request
                .delete(`/healthpost/${healthpost_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });
});