process.env.NODE_ENV = 'test';

const Blood = require('../models/blood');
const Hospital = require('../models/healthFacilities');

var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

var should = chai.should();

describe('Blood', () => {

    describe('Request on /blood', function () {
        let blood = {
            bloodGroup: "A+ve",
            collectedDateTime: "2018-08-09",
            storedDateTime: "2019-09-10",
            expiryDateTime: "2020-09-08",
            quantity: 18
        };

        let hospital = new Hospital({
            name: 'ABC',
            location: 'CDE',
            gps_location: {
                coordinates: ['25.2', '85.1']
            },
            type:'hospital'
        });

        var hp_data = null;
        var blood_data = null;
        before((done) => {
            hospital.save().then((data) => {
                hp_data = data;
                blood.healthFacilities = data._id;
                Blood(blood).save().then((data_blood) => {
                    blood_data = data_blood;
                    done();
                });
            });
        });

        after((done) => {
            Hospital.collection.drop();
            Blood.collection.drop();
            done();
        });

        it('It should GET all the records in the blood', (done) => {
            chai.request(server)
                .get('/blood')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                    done();
                });
        });

        it('it should  POST blood information', (done) => {
            const blood_new = {
                bloodGroup: "AB+ve",
                collectedDateTime: "2020-09-09",
                storedDateTime: "2020-09-20",
                expiryDateTime: "2022-07-08",
                quantity: 19,
                healthFacilities: hp_data._id
            };
            chai.request(server)
                .post('/blood')
                .send(blood_new)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('bloodGroup');
                    res.body.should.have.property('collectedDateTime');
                    res.body.should.have.property('storedDateTime');
                    res.body.should.have.property('expiryDateTime');
                    res.body.should.have.property('quantity');
                    res.body.should.have.property('healthFacilities');
                    done();
                });
        });

        it('It should DELETE all the records in the blood ', (done) => {
            chai.request(server)
                .delete(`/blood`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.equal('Successfully deleted');
                    done();
                });
        });
    });

    describe('Request on /blood/id', function () {
        let blood = {
            bloodGroup: "A+ve",
            collectedDateTime: "2018-08-09",
            storedDateTime: "2019-09-10",
            expiryDateTime: "2020-09-08",
            quantity: 18
        };

        let hospital = new Hospital({
            name: 'ABC',
            location: 'CDE',
            gps_location: {
                coordinates: ['25.2', '85.1']
            },
            type:'hospital'
        });
        var hp_data = null;
        var blood_data = null;
        before((done) => {
            hospital.save().then((data) => {
                hp_data = data;
                blood.healthFacilities = data._id;
                Blood(blood).save().then((data_blood) => {
                    blood_data = data_blood;
                    done();
                });
            });
        });

        after((done) => {
            Hospital.collection.drop();
            Blood.collection.drop();
            done();
        });

        it('it should GET information about blood by the given id', (done) => {
            chai.request(server)
                .get(`/blood/${blood_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('bloodGroup');
                    res.body.should.have.property('collectedDateTime');
                    res.body.should.have.property('storedDateTime');
                    res.body.should.have.property('expiryDateTime');
                    res.body.should.have.property('quantity');
                    res.body.should.have.property('_id');
                    res.body._id.should.be.equal(blood_data._id.toString());
                    done();
                });
        });

        it('it should UPDATE information of blood given the id', (done) => {
            let blood_update = {
                quantity: 50
            }
            chai.request(server)
                .put(`/blood/${blood_data._id}`)
                .send(blood_update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.quantity.should.equal(blood_update.quantity);
                    done();
                });
        });

        it('It should DELETE all the records in the blood according to id', (done) => {
            chai.request(server)
                .delete(`/blood/${blood_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.equal('Successfully deleted');
                    done();
                });
        });
    });
});