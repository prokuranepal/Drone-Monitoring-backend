const {
    request,
    loginWithDefaultUser,
    loginWithHealthPostUser,
    getMainHospital,
    getHealthPost,
    cleanHealthPostData,
    chai
} = require("./common.test");
let Order = require('../models/orders');
var should = chai.should();

describe('Order Request Test', () => {
    let token;
    let token1;
    let hospital_id;
    let healthpost_id;
    let order = {
        name:"order 1",
        orderDate:"2020/12/12",
        deliveryDate:"2020/12/13"
    };

    before(async () => {
        let hospital = await getMainHospital();
        hospital_id = hospital._id;
        let healthpost = await getHealthPost();
        healthpost_id = healthpost._id;
        let resToken = await loginWithDefaultUser();
        token = resToken.body.token;
        let resToken1 = await loginWithHealthPostUser();
        token1 = resToken1.body.token;
        order.origin = healthpost_id;
        order.destination = hospital_id;
    });

    after(async () => {
        await cleanHealthPostData();
    });

    describe('Request on /orders', function () {

        let order_data;

        before(async () => {
            order_data = await Order(order).save();
        });


        after(async () => {
            await Order.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options('/orders')
                .expect(200)
        });

        it('It should GET all the records in the order with hospital user', () => {
            return request.get('/orders')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should GET all the records in the order with healthpost user', () => {
            return request.get('/orders')
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('it should  POST order information', () => {
            const order_new = {
                name:"order 1",
                orderDate:"2020/12/12",
                deliveryDate:"2020/12/13",
                origin: healthpost_id,
                destination: hospital_id
            };
            return request
                .post('/orders')
                .set("Authorization", `Bearer ${token1}`)
                .send(order_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('orderDate');
                    res.body.should.have.property('origin');
                });
        });

        it('It should DELETE all the records in the order', () => {
            return request
                .delete('/orders')
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });
        });
    });


    describe('Request on /orders/id', function () {

        let order_data = null;

        before(async () => {
            order_data = await Order(order).save();
        });

        after(async () => {
            await Order.collection.drop();
        });

        it('It should do OPTIONS request', () => {
            return request.options(`/orders/${order_data._id}`)
                .expect(200)
        });

        it('it should GET information about order by the given id', () => {
            return request
                .get(`/orders/${order_data._id}`)
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('status');
                    res.body.should.have.property('orderLifeCycle');
                    res.body._id.should.equal(order_data._id.toString())
                });
        });

        it('it should UPDATE information of order given the id with update status', () => {
            let order_update = {
                status: 'completed',
            };
            return request
                .put(`/orders/${order_data._id}`)
                .set("Authorization", `Bearer ${token1}`)
                .send(order_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.status.should.equal(order_update.status);
                });

        });

        it('it should UPDATE information of order given the id with update orderLifeCycle', () => {
            let order_update = {
                orderLifeCycle:'Order Confirmed'
            };
            return request
                .put(`/orders/${order_data._id}`)
                .set("Authorization", `Bearer ${token1}`)
                .send(order_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.orderLifeCycle.should.equal(order_update.orderLifeCycle);
                });

        });

        it('It should DELETE all the records in the order according to id', () => {
            return request
                .delete(`/orders/${order_data._id}`)
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });

    describe('Request on /orders/id', function () {
        let order_data = null;

        before(async () => {
            order_data = await Order(order).save();
        });

        after(async () => {
            await Order.collection.drop();
        });

        it('It should do cancel request', () => {
            return request
                .put(`/orders/${order_data._id}/cancel`)
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .expect(res => {
                    res.body.status.should.equal('cancelled')
                })
        });
    });
});