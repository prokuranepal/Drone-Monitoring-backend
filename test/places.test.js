const {
    request,
    loginWithDefaultUser,
    getMainHospital,
    chai
} = require("./common.test");
let Places = require('../models/places');
var should = chai.should();

describe('place Request Test', () => {
    let token;
    let hospital_id;
    let place = {
        name: "spoiler66",
        gps_location: {
            coordinates: ['45.22', '342.324']
        }
    };

    before(async () => {
        let hospital = await getMainHospital();
        hospital_id = hospital._id;
        let resToken = await loginWithDefaultUser();
        token = resToken.body.token;
        place.healthFacilities = hospital_id;
    });

    describe('Request on /places', function () {

        let place_data;

        before(async () => {
            place_data = await Places(place).save();
        });


        after(async () => {
            await Places.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options('/places')
                .expect(200)
        });

        it('It should GET all the records in the place', () => {
            return request.get('/places')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should PUT all the records in the place', () => {
            return request.put('/places')
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('it should  POST place information', () => {
            const place_new = {
                name: "hollow94",
                gps_location: {
                    coordinates: ['45.22', '342.324']
                },
                healthFacilities: hospital_id
            };
            return request
                .post('/places')
                .set("Authorization", `Bearer ${token}`)
                .send(place_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('healthFacilities');
                });
        });

        it('It should DELETE all the records in the place', () => {
            return request
                .delete('/places')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });
        });
    });


    describe('Request on /places/id', function () {

        let place_data = null;

        before(async () => {
            place_data = await Places(place).save();
        });

        after(async () => {
            await Places.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options(`/places/${place_data._id}`)
                .expect(200)
        });

        it('it should GET information about place by the given id', () => {
            return request
                .get(`/places/${place_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('healthFacilities');
                    res.body._id.should.equal(place_data._id.toString())
                });
        });

        it('it should UPDATE information of place given the id', () => {
            let place_update = {
                name: "hahaha"
            };
            return request
                .put(`/places/${place_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(place_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.name.should.equal(place_update.name);
                });

        });

        it('It should do POST request', () => {
            return request.post(`/places/${place_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('It should DELETE all the records in the place according to id', () => {
            return request
                .delete(`/places/${place_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });
});