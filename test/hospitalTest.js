// process.env.NODE_ENV = 'test';


// var chai = require('chai');
// var server = require('../app');
// var chaiHTTP = require('chai-http');
// const Hospital = require('../models/healthFacilities');
// var should = chai.should();

// chai.use(chaiHTTP);

// describe('Hospital', () => {
//     describe('Request on /hospital', function () {
//         let hospital = {
//             name: "Norvic hospital",
//             location: "abc",
//             gps_location: {
//                 coordinates: ['45.22', '342.324']
//             },
//             type:'hospital'
//         };

//         let hospital_data = null;

//         before((done) => {
//             Hospital(hospital).save().then((data) => {
//                 hospital_data = data;
//                 done();
//             });
//         });

//         after((done) => {
//             Hospital.collection.drop();
//             done();
//         });

//         it('It should GET all the records in the Hospital', (done) => {
//             chai.request(server)
//                 .get('/hospital')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eq(1);
//                     done();
//                 });
//         });

//         it('it should  POST hospital information', (done) => {
//             const hospital_new = {
//                 name: "Medicare Hospital",
//                 location: 'xyz',
//                 gps_location: {
//                     coordinates: ['45.22', '342.324']
//                 }
//             };
//             chai.request(server)
//                 .post('/hospital')
//                 .send(hospital_new)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('name');
//                     res.body.should.have.property('location');
//                     res.body.should.have.property('gps_location');
//                     done();
//                 });
//         });

//         it('It should DELETE all the records in the hospital', (done) => {
//             chai.request(server)
//                 .delete('/hospital')
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     done();
//                 });
//         });
//     });


//     describe('Request on /hospital/id', function () {
//         let hospital = {
//             name: "kathmandu pharma",
//             location: "xyz",
//             gps_location: {
//                 coordinates: ['45.22', '342.324']
//             },
//             type:'hospital'
//         };

//         let hospital_data = null;

//         before((done) => {
//             Hospital(hospital).save().then((data) => {
//                 hospital_data = data;
//                 done();
//             });
//         });

//         after((done) => {
//             Hospital.collection.drop();
//             done();
//         });

//         it('it should GET information about hospital by the given id', (done) => {
//             chai.request(server)
//                 .get(`/hospital/${hospital_data._id}`)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('name');
//                     res.body.should.have.property('location');
//                     res.body._id.should.equal(hospital_data._id.toString());
//                     done();
//                 });
//         });

//         it('it should UPDATE information of hospital given the id', (done) => {
//             let hospital_update = {
//                 location: 'kalimati'
//             };
//             chai.request(server)
//                 .put(`/hospital/${hospital_data._id}`)
//                 .send(hospital_update)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     res.body.should.be.a('object');
//                     res.body.location.should.equal(hospital_update.location);
//                     done();
//                 });

//         });

//         it('It should DELETE all the records in the hospital according to id', (done) => {
//             chai.request(server)
//                 .delete(`/hospital/${hospital_data._id}`)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     done();
//                 });

//         });

//     });
// });