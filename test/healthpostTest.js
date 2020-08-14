process.env.NODE_ENV = 'test';

let HealthPost = require('../models/healthFacilities');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
var should = chai.should();

chai.use(chaiHTTP);

describe('Healthpost', () => {
    describe('Request on /healthpost', function () {
        let healthPost = {
            name: "kathmandu pharma",
            location: "xyz",
            gps_location: {
                coordinates: ['45.22', '342.324']
            },
            type:'healthpost'
        };

        let healthpost_data = null;

        before((done) => {
            HealthPost(healthPost).save().then((data) => {
                healthpost_data = data;
                done();
            });
        });

        after((done) => {
            HealthPost.collection.drop();
            done();
        });

        it('It should GET all the records in the healthpost', (done) => {
            chai.request(server)
                .get('/healthpost')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                    done();
                });
        });

        it('it should  POST healthpost information', (done) => {
            const healthpost_new = {
                name: "Baidhya healthpost",
                location: 'xyz',
                gps_location: {
                    coordinates: ['45.22', '342.324']
                }
            };
            chai.request(server)
                .post('/healthpost')
                .send(healthpost_new)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('location');
                    res.body.should.have.property('employee');
                    res.body.should.have.property('medicine');
                    res.body.should.have.property('gps_location');
                    done();
                });
        });

        it('It should DELETE all the records in the healthpost', (done) => {
            chai.request(server)
                .delete('/healthpost')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.equal('Successfully deleted');
                    done();
                });
        });
    });


    describe('Request on /healthpost/id', function () {
        let healthPost = {
            name: "kathmandu pharma",
            location: "xyz",
            gps_location: {
                coordinates: ['45.22', '342.324']
            },
            type:'healthpost'
        };

        let healthpost_data = null;

        before((done) => {
            HealthPost(healthPost).save().then((data) => {
                healthpost_data = data;
                done();
            });
        });

        after((done) => {
            HealthPost.collection.drop();
            done();
        });

        it('it should GET information about healthpost by the given id', (done) => {
            chai.request(server)
                .get(`/healthpost/${healthpost_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('location');
                    res.body.should.have.property('employee');
                    res.body.should.have.property('medicine');
                    res.body.should.have.property('gps_location');
                    res.body._id.should.equal(healthpost_data._id.toString());
                    done();
                });
        });

        it('it should UPDATE information of healthpost given the id', (done) => {
            let healthpost_update = {
                location: 'Bhaktapur'
            };
            chai.request(server)
                .put(`/healthpost/${healthpost_data._id}`)
                .send(healthpost_update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.location.should.equal(healthpost_update.location);
                    done();
                });

        });

        it('It should DELETE all the records in the healthpost according to id', (done) => {
            chai.request(server)
                .delete(`/healthpost/${healthpost_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.equal('Successfully deleted');
                    done();
                });

        });

    });
});