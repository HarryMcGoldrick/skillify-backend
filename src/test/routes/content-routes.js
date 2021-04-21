process.env.NODE_ENV = 'test'
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');

const baseUrl = '/content'
const dummyContent = require('../dummyData').dummyContent;
let dummyContentId;

describe('Content', () => {
    it('Add Content', (done) => {
        request(app).post(baseUrl)
        .send({nodeId: dummyContent.nodeId, content: dummyContent})
        .then((res) => {
            const { response } = res.body;
            dummyContentId = response;
            expect(response).exist;
            expect(res.status).equal(200);
            done();
        })
    })

    it('Fetch Content', (done) => {
        request(app).get(`${baseUrl}/${dummyContent.nodeId}`)
        .send({})
        .then((res) => {
            const { content } = res.body;
            expect(content[0].externalId).equal(dummyContent.externalId);
            expect(res.status).equal(200);
            done();
        })
    })

    it('Fetch Content with Invalid Data', (done) => {
        request(app).get(`${baseUrl}/BADNODEID`)
        .send({})
        .then((res) => {
            const { error  } = res.body;
            expect(error).equal('Content fetch failed');
            expect(res.status).equal(400);
            done();
        })
    })


    it('Delete Content', (done) => {
        request(app).delete(`${baseUrl}/${dummyContentId}`)
        .send({})
        .then((res) => {
            const { response } = res.body;
            expect(response.n).equals(1);
            expect(response.deletedCount).equals(1);
            expect(response.ok).equals(1);
            expect(res.status).equal(200);
            done();
        })
    })
})