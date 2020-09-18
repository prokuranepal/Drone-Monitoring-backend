const {
    request,
    loginWithDefaultUser,
    getMainHospital,
    chai
} = require("./common.test");
let Medicine = require('../models/medicines'); 
let should = chai.should();

describe('Medicine Request Test', () => {
    let token;
    let hospital_id;
    let user_id;
    let medicine = {
        name:"medicine 1",
        dosage:"12",
        quantity:12,
        unit:12,
        class:"class-1",
        description:"fasdfa",
        company:"qwe",
        exp_date:"2012-12-12",
        price:12,
        type:"liquid"
    };

    before(async () => {
        let hospital = await getMainHospital();
        hospital_id = hospital._id;
        let resToken = await loginWithDefaultUser();
        token = resToken.body.token;
        user_id = resToken.body.userId;
        medicine.healthFacilities = hospital_id;
        medicine.user_added = resToken.body.userId;
    });

    describe('Request on /medicines', function () {

        let medicine_data;

        before(async () => {
            medicine_data = await Medicine(medicine).save();
        });


        after(async () => {
            await Medicine.collection.drop();
        });

        it('It should do OPTIONS request medicines', () => {
            return request.options('/medicines')
                .expect(200)
        });

        it('It should GET all the records in the medicines with query', () => {
            return request.get('/medicines')
                .query({
                    type: "liquid",
                })
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should GET all the records in the medicines', () => {
            return request.get('/medicines')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(1);
                });
        });

        it('It should PUT all the records in the medicines', () => {
            return request.put('/medicines')
                .set("Authorization", `Bearer ${token}`)
                .expect(403)
        });

        it('it should  POST medicines information', () => {
            let medicine_new = {
                name:"medicine 2",
                dosage:"12",
                quantity:12,
                unit:12,
                class:"class-1",
                description:"fasdfa",
                company:"qwe",
                exp_date:"2012-12-12",
                price:12,
                type:"liquid",
                healthFacilities : hospital_id,
                user_added : user_id
            };
            return request
                .post('/medicines')
                .set("Authorization", `Bearer ${token}`)
                .send(medicine_new)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('type');
                    res.body.should.have.property('healthFacilities');
                });
        });

        it('It should DELETE all the records in the medicines', () => {
            return request
                .delete('/medicines')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });
        });
    });


    describe('Request on /medicines/id', function () {

        let medicine_data = null;

        before(async () => {
            medicine_data = await Medicine(medicine).save();
        });

        after(async () => {
            await Medicine.collection.drop();
        });

        it('It should do OPTIONS request /medicines/id', () => {
            return request.options(`/medicines/${medicine_data._id}`)
                .expect(200)
        });

        it('it should GET information about medicines by the given id', () => {
            return request
                .get(`/medicines/${medicine_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('healthFacilities');
                    res.body.should.have.property('type');
                    res.body._id.should.equal(medicine_data._id.toString())
                });
        });

        it('it should UPDATE information of medicines given the id', () => {
            let medicine_update = {
                class:"class-2"
            };
            return request
                .put(`/medicines/${medicine_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(medicine_update)
                .expect(200)
                .expect(res => {
                    res.body.should.be.a('object');
                    res.body.class.should.equal(medicine_update.class);
                });

        });

        it('It should do POST request', () => {
            return request.post(`/medicines/${medicine_data._id}`)
            .set("Authorization", `Bearer ${token}`)
                .expect(403);
        });

        it('It should DELETE all the records in the medicine according to id', () => {
            return request
                .delete(`/medicines/${medicine_data._id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.msg.should.equal('Successfully Deleted');
                    res.body.status.should.equal('OK');
                });

        });

    });
});