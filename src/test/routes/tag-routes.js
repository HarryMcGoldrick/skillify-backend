const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');

const dummyTags = require('../dummyData').dummyTags;

const baseUrl = '/tag';

describe('Tags', () => {
    it('Fetch Tags with empty database', (done) => {
        request(app).get(`${baseUrl}`)
        .send({})
        .then((res) => {
            const { tags } = res.body;
            expect(tags).empty;
            expect(res.status).equal(200);
            done();
        })
    })

    it('Add Tag', (done) => {
        request(app).post(`${baseUrl}`)
        .send({tag: dummyTags[0]})
        .then((res) => {
            const { response } = res.body;
            expect(response).exist
            expect(res.status).equal(200);
            done();
        })
    })

    it('Delete Tag', (done) => {
        request(app).post(`${baseUrl}`)
        .send({tag: dummyTags[0]})
        .then((res) => {
            const { response } = res.body;
            expect(response).exist
            expect(res.status).equal(200);
            done();
        })
    })

    it('Add Many Tags', (done) => {
        request(app).post(`${baseUrl}/many`)
        .send({tagArray: dummyTags})
        .then((res) => {
            const { response } = res.body;
            expect(response[0]).exist
            expect(response[1]).exist
            expect(res.status).equal(200);
            done();
        })
    })

    it('Fetch Many Tags', (done) => {
        request(app).get(`${baseUrl}`)
        .send({})
        .then((res) => {
            const { tags } = res.body;
            expect(tags[0]).equal(dummyTags[0].tag)
            expect(tags[1]).equal(dummyTags[1].tag)
            expect(res.status).equal(200);
            done();
        })
    })
})


