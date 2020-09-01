process.env.NODE_ENV = 'test';

const Vaccine = require('../models/vaccine');
const Hospital = require('../models/healthFacilities');

var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');

chai.use(chaiHTTP);

var should = chai.should();

describe('Vaccine', () => {

    describe('Request on /vaccine', function () {
        let vaccine = {
            vaccineName: "Measeles vaccine",
            vaccineUsedFor: "abc",
            expiryDateTime: "2019-06-07",
        };

        let hospital = new Hospital({
            name: 'ABC',
            location: 'CDE',
            gps_location: {
                coordinates: ['25.2', '85.1']
            },
            type:'hospital'
        });

        var hos_data = null;
        var vaccine_data = null;
        before((done) => {
            hospital.save().then((data) => {
                hos_data = data;
                vaccine.healthFacilities = data._id;
                Vaccine(vaccine).save().then((data_vaccine) => {
                    vaccine_data = data_vaccine;
                    done();
                });
            });
        });

        after((done) => {
            Hospital.collection.drop();
            Vaccine.collection.drop();
            done();
        });

        it('It should GET all the records in the vaccine', (done) => {
            chai.request(server)
                .get('/vaccine')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                    done();
                });
        });

        it('it should  POST vaccine information', (done) => {
            const new_vaccine = {
                vaccineName: "Measeles vaccine",
                vaccineUsedFor: "abc",
                expiryDateTime: "2019-06-07",
                healthFacilities: hos_data._id
            };
            chai.request(server)
                .post('/vaccine')
                .send(new_vaccine)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('vaccineName');
                    res.body.should.have.property('vaccineUsedFor');
                    res.body.should.have.property('expiryDateTime');
                    res.body.should.have.property('healthFacilities');
                    done();
                });
        });

        it('It should DELETE all the records in the vaccine ', (done) => {
            chai.request(server)
                .delete(`/vaccine`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.equal('Successfully deleted');
                    done();
                });
        });
    });

    describe('Request on /vaccine/id', function () {
        let vaccine = {
            vaccineName: "Measeles vaccine",
            vaccineUsedFor: "abc",
            expiryDateTime: "2019-06-07"

        };

        let hospital = new Hospital({
            name: 'ABC',
            location: 'CDE',
            gps_location: {
                coordinates: ['25.2', '85.1']
            },
            type:'hospital'
        });

        var hos_data = null;
        var vaccine_data = null;
        before((done) => {
            hospital.save().then((data) => {
                hos_data = data;
                vaccine.healthFacilities = data._id;
                Vaccine(vaccine).save().then((data_vaccine) => {
                    vaccine_data = data_vaccine;
                    done();
                });
            });
        });

        after((done) => {
            Hospital.collection.drop();
            Vaccine.collection.drop();
            done();
        });

        it('it should GET information about vaccine by the given id', (done) => {
            chai.request(server)
                .get(`/vaccine/${vaccine_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('vaccineName');
                    res.body.should.have.property('vaccineUsedFor');
                    res.body.should.have.property('expiryDateTime');
                    res.body.should.have.property('_id');
                    res.body._id.should.be.equal(vaccine_data._id.toString());
                    done();
                });
        });

        it('it should UPDATE information of vaccine given the id', (done) => {
            let vaccine_update = {
                vaccineUsedFor: "yyy"
            }
            chai.request(server)
                .put(`/vaccine/${vaccine_data._id}`)
                .send(vaccine_update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.vaccineUsedFor.should.equal(vaccine_update.vaccineUsedFor);
                    done();
                });
        });

        it('It should DELETE all the records in the vaccine according to id', (done) => {
            chai.request(server)
                .delete(`/vaccine/${vaccine_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.equal('Successfully deleted');
                    done();
                });
        });
    });
});