process.env.NODE_ENV = "test";
const User = require('../models/users');
const Hospital = require('../models/healthFacilities');

const express = require('../app');

const request = require("supertest")(express);
exports.request = request;
const chai = require("chai");
exports.chai = chai;
exports.should = chai.should();

const mainHospital = {
    "name":"main hospital",
    "location":"kathmandu",
    "type":"hospital"
}

const defaultUser = {
    "email":"test@test.com",
    "phone_number":"9840016500",
    "password":"suhil",
    "first_name":"sushil",
    "last_name":"khadka",
    "health_facilities":"fa"
}

const loginUser = {
    "email":"9840016500",
    "password":"suhil"
}

const healthPost = {
    "name":"healthpost",
    "location":"kathmandu",
    "type":"healthpost"
}

const healthPostUser = {
    "email":"test1@test.com",
    "phone_number":"9840016501",
    "password":"suhil",
    "first_name":"sushil",
    "last_name":"khadka",
    "health_facilities":"fa"
}

const healthPostLoginUser = {
    "email":"9840016501",
    "password":"suhil"
}

const createHospital = async() => {
    const HospitalModel = new Hospital(mainHospital);
    await HospitalModel.save();
}

const getMainHospital = async() => {
    let hospital = await Hospital.find({"name":"main hospital","type":"hospital"});
    if (hospital.length === 0) {
        await createHospital();
        return getMainHospital();
    } else {
        return hospital[0];
    }
}

const createHealthPost = async() => {
    let hospital = await getMainHospital();
    healthPost.hospital = hospital._id;
    const HealthPostModel = new Hospital(healthPost);
    await HealthPostModel.save();
}

const getHealthPost = async() => {
    let healthPost = await Hospital.find({"name":"healthpost","type":"healthpost"});
    if (healthPost.length === 0) {
        await createHealthPost();
        return getHealthPost();
    } else {
        return healthPost[0];
    }
}

exports.getMainHospital = getMainHospital;
exports.getHealthPost = getHealthPost;

const createUser = async () => {
    let hospital = await getMainHospital();
    defaultUser.health_facilities = hospital._id;
    await request.post('/users/signup').send(defaultUser).expect(200);
}

const createHealthPostUser = async () => {
    let healthpost = await getHealthPost();
    healthPostUser.health_facilities = healthpost._id;
    await request.post('/users/signup').send(healthPostUser).expect(200);
}

const getDefaultUser = async () => {
    let users = await User.find({"phonenumber":"9840016500"});
    if (users.length === 0) {
        await createUser();
        return getDefaultUser();
    } else {
        return users[0];
    }
}

const getHealthPostUser = async () => {
    let users = await User.find({"phonenumber":"9840016501"});
    if (users.length === 0) {
        await createHealthPostUser();
        return getHealthPostUser();
    } else {
        return users[0];
    }
}

exports.loginWithDefaultUser = async () => {
    let user = await getDefaultUser();
    return request.post('/users/login').send(loginUser).expect(200);
};

exports.loginWithHealthPostUser = async () => {
    let user = await getHealthPostUser();
    return request.post('/users/login').send(healthPostLoginUser).expect(200);
};

exports.cleanExceptDefaultUser = async() => {
    let user = await getDefaultUser();
    await User.deleteMany({"email": {$ne:user.email}});
}

exports.cleanHealthPostData = async() => {
    let healthpost = await getHealthPost();
    let healthpostUser = await getHealthPostUser();
    await Hospital.remove({_id:healthpost._id});
    await User.remove({_id:healthpostUser._id});
}