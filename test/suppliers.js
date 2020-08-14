 process.env.NODE_ENV = 'test';
 var Suppliers = require('../models/suppliers');
 var server = require('../app');

 var chai = require('chai');
 var chaiHttp = require('chai-http');
 var mongoose = require("mongoose");


 var should = chai.should();
 chai.use(chaiHttp);


 describe('suppliers', () => {
 	describe('Request on /supplier', function () {
 		let suppliers = {
 			Name: "xyz",
 			Contact: 9800000000
 		};

 		let supplier_data = null;

 		before(function (done) {
 			Suppliers(suppliers).save().then((data) => {
 				supplier_data = data;
 				done();
 			});
 		});

 		after(function (done) {
 			Suppliers.collection.drop();
 			done();
 		});

 		it('Should display all the information related to the suppliers', (done) => {
 			chai.request(server)
 				.get('/suppliers')
 				.end((err, res) => {
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.should.be.a('array');
 					res.body[0].should.have.property('Name');
 					res.body[0].should.have.property('Contact');
 					res.body[0].Name.should.equal(suppliers.Name);
 					res.body[0].Contact.should.equal(suppliers.Contact);
 					done();
 				});
 		});

 		it('should add a supplier on /suppliers POST', (done) => {
 			let supplier_new = {
 				Name: 'abc',
 				Contact: 9800000000
 			};
 			chai.request(server)
 				.post('/suppliers')
 				.send(supplier_new)
 				.end((err, res) => {
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.should.be.a('object');
 					res.body.should.have.property('Name');
 					res.body.should.have.property('Contact');
 					res.body.Name.should.equal(supplier_new.Name);
 					res.body.Contact.should.equal(supplier_new.Contact);
 					done();
 				});

 		});

 		it('should delete a all suppliers', (done) => {
 			chai.request(server)
 				.delete('/suppliers')
 				.end((err, res) => {
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.message.should.equal('Successfully deleted');
 					done();
 				});
 		});
 	});


 	describe('Request on /supplier/id', function () {
 		let suppliers = {
 			Name: "xyz",
 			Contact: 9800000000
 		};

 		let supplier_data = null;

 		before(function (done) {
 			Suppliers(suppliers).save().then((data) => {
 				supplier_data = data;
 				done();
 			});
 		});

 		after(function (done) {
 			Suppliers.collection.drop();
 			done();
 		});

 		it('should list a SINGLE suppliers<id> GET', function (done) {
 			chai.request(server)
 				.get(`/suppliers/${supplier_data._id}`)
 				.end((err, res) => {
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.should.be.a('object');
 					res.body.should.have.property('_id');
 					res.body.should.have.property('Name');
 					res.body.should.have.property('Contact');
 					res.body.Name.should.equal(suppliers.Name);
 					res.body.Contact.should.equal(suppliers.Contact);
 					res.body._id.should.equal(supplier_data._id.toString());
 					done();
 				});
 		});

 		it('should update a SINGLE suppliers on /suppliers/<id> PUT', (done) => {
 			let supplier_update = {
 				Contact: 9800000001
 			};
 			chai.request(server)
 				.put(`/suppliers/${supplier_data._id}`)
 				.send(supplier_update)
 				.end((err, res) => {
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.should.be.a('object');
 					res.body.should.have.property('Name');
 					res.body.should.have.property('_id');
 					res.body.Contact.should.equal(supplier_update.Contact);
 					done();
 				});
 		});

 		it('should delete a SINGLE suppliers on /suppliers/<id> DELETE', (done) => {
 			chai.request(server)
 				.delete(`/suppliers/${supplier_data._id}`)
 				.end((err, res) => {
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.message.should.equal('Successfully deleted');
 					done();
 				});
 		});
 	});
 });