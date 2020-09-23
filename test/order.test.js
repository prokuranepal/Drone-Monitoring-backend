// const {
//     request,
//     loginWithDefaultUser,
//     getMainHospital,
//     chai
// } = require("./common.test");
// let Order = require('../models/orders');
// var should = chai.should();

// describe('Order Request Test', () => {
//     let token;
//     let hospital_id;
//     let order = {
//         orderId: "215",
//         name: "spoiler66",
//         status: 1,
//         type: 1
//     };

//     before(async () => {
//         let hospital = await getMainHospital();
//         hospital_id = hospital._id;
//         let resToken = await loginWithDefaultUser();
//         token = resToken.body.token;
//         order.hospital = hospital_id;
//         order.hospital = hospital_id;
//     });

//     describe('Request on /order', function () {

//         let order_data;

//         before(async () => {
//             order_data = await order(order).save();
//         });


//         after(async () => {
//             await order.collection.drop();
//         });

//         it('It should do OPTIONS request', () => {
//             return request.options('/orders')
//                 .expect(200)
//         });

//         it('It should GET all the records in the order with query', () => {
//             return request.get('/orders')
//                 .query({
//                     type: 1,
//                     status: 1
//                 })
//                 .set("Authorization", `Bearer ${token}`)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eq(1);
//                 });
//         });

//         it('It should GET all the records in the order', () => {
//             return request.get('/orders')
//                 .set("Authorization", `Bearer ${token}`)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.should.be.a('array');
//                     res.body.length.should.be.eq(1);
//                 });
//         });

//         it('it should  POST order information', () => {
//             const order_new = {
//                 orderId: "213",
//                 name: "hollow94",
//                 status: 0,
//                 type: 2,
//                 hospital: hospital_id
//             };
//             return request
//                 .post('/orders')
//                 .set("Authorization", `Bearer ${token}`)
//                 .send(order_new)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('name');
//                     res.body.should.have.property('status');
//                     res.body.should.have.property('type');
//                 });
//         });

//         it('It should DELETE all the records in the order', () => {
//             return request
//                 .delete('/orders')
//                 .set("Authorization", `Bearer ${token}`)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.msg.should.equal('Successfully Deleted');
//                     res.body.status.should.equal('OK');
//                 });
//         });
//     });


//     describe('Request on /order/id', function () {

//         let order_data = null;

//         before(async () => {
//             order_data = await order(order).save();
//         });

//         after(async () => {
//             await order.collection.drop();
//         });

//         it('It should do OPTIONS request', () => {
//             return request.options(`/orders/${order_data._id}`)
//                 .expect(200)
//         });

//         it('it should GET information about order by the given id', () => {
//             return request
//                 .get(`/orders/${order_data._id}`)
//                 .set("Authorization", `Bearer ${token}`)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.should.be.a('object');
//                     res.body.should.have.property('name');
//                     res.body.should.have.property('status');
//                     res.body.should.have.property('type');
//                     res.body._id.should.equal(order_data._id.toString())
//                 });
//         });

//         it('it should UPDATE information of order given the id', () => {
//             let order_update = {
//                 status: 2
//             };
//             return request
//                 .put(`/orders/${order_data._id}`)
//                 .set("Authorization", `Bearer ${token}`)
//                 .send(order_update)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.should.be.a('object');
//                     res.body.status.should.equal(order_update.status);
//                 });

//         });

//         it('It should DELETE all the records in the order according to id', () => {
//             return request
//                 .delete(`/orders/${order_data._id}`)
//                 .set("Authorization", `Bearer ${token}`)
//                 .expect(200)
//                 .expect(res => {
//                     res.body.msg.should.equal('Successfully Deleted');
//                     res.body.status.should.equal('OK');
//                 });

//         });

//     });
// });