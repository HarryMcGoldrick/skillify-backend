const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');

const dummyObjective = require('../dummyData').dummyObjective;

const baseUrl = '/objective';

describe('Objectives', () => {
    it('Add Objective', (done) => {
        request(app).post(`${baseUrl}`)
        .send({userId: dummyObjective.userId, nodeId: dummyObjective.nodeId, 
                items: dummyObjective.items})
        .then((res) => {
            const { type, updated } = res.body;
            expect(type).equal('add')
            expect(updated).exist
            expect(res.status).equal(200);
            done();
        })
    })


    it('Get Objective by Id', (done) => {
        request(app).get(`${baseUrl}/${dummyObjective.userId}/${dummyObjective.nodeId}`)
        .send({})
        .then((res) => {
            const item = res.body.items[0];
            expect(item.label).equal(dummyObjective.items[0].label)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Update Objective', (done) => {
        request(app).post(`${baseUrl}`)
        .send({userId: dummyObjective.userId, nodeId: dummyObjective.nodeId, 
                items: dummyObjective.items})
        .then((res) => {
            const { type, updated } = res.body;
            expect(type).equal('update')
            expect(updated).exist
            expect(res.status).equal(200);
            done();
        })
    })
})


