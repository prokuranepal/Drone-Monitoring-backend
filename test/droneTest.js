process.env.NODE_ENV = 'test';

let Drone = require('../models/drone');
var chai = require('chai');
var server = require('../app');
var chaiHTTP = require('chai-http');
var should = chai.should();

chai.use(chaiHTTP);

describe('Drone Request Test', () => {
    describe('Request on /drone', function () {
        let drone = {
            name: "spoiler66",
            status: "active",
            type: 'Plane'
        };

        let drone_data = null;
        before((done) => {
            Drone(drone).save().then((data) => {
                drone_data = data;
                done();
            });
        });


        after((done) => {
            Drone.collection.drop();
            done();
        });

        it('It should GET all the records in the drone', (done) => {
            chai.request(server)
                .get('/drone')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                    done();
                });
        });

        it('it should  POST drone information', (done) => {
            const drone_new = {
                name: "hollow94",
                status: 'unactive',
                type: "VTOL"
            };
            chai.request(server)
                .post('/drone')
                .send(drone_new)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('status');
                    res.body.should.have.property('type');
                    done();
                });
        });

        it('It should DELETE all the records in the drone', (done) => {
            chai.request(server)
                .delete('/drone')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });


    describe('Request on /drone/id', function () {
        let drone = {
            name: "spoiler66",
            status: "active",
            type: 'Plane'
        };

        let drone_data = null;
        before((done) => {
            Drone(drone).save().then((data) => {
                drone_data = data;
                done();
            });
        });
        after((done) => {
            Drone.collection.drop();
            done();
        });



        it('it should GET information about drone by the given id', (done) => {
            chai.request(server)
                .get(`/drone/${drone_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('status');
                    res.body.should.have.property('type');
                    res.body._id.should.equal(drone_data._id.toString());
                    done();
                });
        });

        it('it should UPDATE information of drone given the id', (done) => {
            let drone_update = {
                status: 'destroyed'
            };
            chai.request(server)
                .put(`/drone/${drone_data._id}`)
                .send(drone_update)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.status.should.equal(drone_update.status);
                    done();
                });

        });

        it('It should DELETE all the records in the drone according to id', (done) => {
            chai.request(server)
                .delete(`/drone/${drone_data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });

        });

    });
});