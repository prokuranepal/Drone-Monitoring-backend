const {
    request,
    loginWithDefaultUser,
    loginWithHealthPostUser,
    getMainHospital,
    getHealthPost,
    cleanHealthPostData,
    chai
} = require("./common.test");
var should = chai.should();

describe('Dashboard data call', () => {
    let token;
    let token1;
    let hospital_id;
    let healthpost_id;

    before(async () => {
        let hospital = await getMainHospital();
        hospital_id = hospital._id;
        let healthpost = await getHealthPost();
        healthpost_id = healthpost._id;
        let resToken = await loginWithDefaultUser();
        token = resToken.body.token;
        let resToken1 = await loginWithHealthPostUser();
        token1 = resToken1.body.token;
    });

    after(async () => {
        await cleanHealthPostData();
    });

    describe('Request on /dashboard', function () {

        it('It should do OPTIONS request', () => {
            return request.options('/dashboard')
                .expect(200)
        });

        it('It should get data according to the logged in user', () => {
            return request
                .get('/dashboard')
                .set("Authorization", `Bearer ${token}`)
                .expect(200)
                .expect(res => {
                    res.body.should.have.property('cardData');
                    res.body.should.have.property('graphs');
                    res.body.cardData.subHealthPosts.should.equal(1);
                });
        });

        it('It should get data according to the logged in user healthpoost', () => {
            return request
                .get('/dashboard')
                .set("Authorization", `Bearer ${token1}`)
                .expect(200)
                .expect(res => {
                    res.body.should.have.property('cardData');
                    res.body.should.have.property('graphs');
                    res.body.cardData.subHealthPosts.should.equal(0);
                });
        });


    });
});