const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');
const graphController = require('../../controllers/graph-controller');
const contentController = require('../../controllers/content-controller');


const dummyUser = require('../dummyData').dummyUser;
const dummyGraph = require('../dummyData').dummyGraph;
const dummyContent = require('../dummyData').dummyContent;
const baseUrl = '/user';
let dummyUserId;
let dummyGraphId;
let dummyContentId;

before(async () => {
    const {name, description, userId, tags} = dummyGraph;
    dummyGraphId = graphController.createNewGraph(name, description, userId, tags).toString();
    dummyContentId = contentController.addContent(dummyContent.nodeId, dummyContent).toString();
  });


describe('Register', () => {
    it('Register with new Username', (done) => {
        request(app).post(`${baseUrl}/register`)
        .send({username: dummyUser.username, password: dummyUser.password})
        .then((res) => {
            const { userId } = res.body;
            expect(userId).exist
            dummyUserId = userId;
            expect(res.status).equal(200);
            done();
        })
    })

    it('Register with existing Username', (done) => {
        request(app).post(`${baseUrl}/register`)
        .send({username: dummyUser.username, password: dummyUser.password})
        .then((res) => {
            const { error } = res.body;
            expect(error).equal("username already exists")
            expect(res.status).equal(200);
            done();
        })
    })

    it('Register with empty data', (done) => {
        request(app).post(`${baseUrl}/register`)
        .send({})
        .then((res) => {
            const { errors } = res.body;
            expect(errors).length(2)
            expect(res.status).equal(400);
            done();
        })
    })
})

describe('Login', () => {
    it('Login with existing User', (done) => {
        request(app).post(`${baseUrl}/login`)
        .send({username: dummyUser.username, password: dummyUser.password})
        .then((res) => {
            const { token } = res.body;
            expect(token).exist
            expect(res.status).equal(200);
            done();
        })
    })

    it('Login with non existant User', (done) => {
        request(app).post(`${baseUrl}/login`)
        .send({username: 'I DONT EXIST', password: dummyUser.password})
        .then((res) => {
            const { error } = res.body;
            expect(error).equal('cannot find user');
            expect(res.status).equal(400);
            done();
        })
    })

    it('Login with empty data', (done) => {
        request(app).post(`${baseUrl}/login`)
        .send({})
        .then((res) => {
            const { errors } = res.body;
            expect(errors).length(2)
            expect(res.status).equal(400);
            done();
        })
    })
})

describe('Fetch Data', () => {
    it('Fetch User data by Id', (done) => {
        request(app).get(`${baseUrl}/${dummyUserId}/userinfo`)
        .send({})
        .then((res) => {
            const { username } = res.body;
            expect(username).equals(dummyUser.username);
            expect(res.status).equal(200);
            done();
        })
    })

    it('Fetch User data by username', (done) => {
        request(app).post(`${baseUrl}/userinfo`)
        .send({username: dummyUser.username})
        .then((res) => {
            const { username } = res.body;
            expect(username).equals(dummyUser.username);
            expect(res.status).equal(200);
            done();
        })
    })

    it('Fetch User progress data by id', (done) => {
        request(app).post(`${baseUrl}/progress`)
        .send({userId: dummyUserId, graphId: dummyGraphId})
        .then((res) => {
            const { completedNodes } = res.body;
            expect(completedNodes).empty;
            expect(res.status).equal(200);
            done();
        })
    })
})

describe('User liked Content / Graphs', () => {
    it('Add liked content', (done) => {
        request(app).post(`${baseUrl}/like/content`)
        .send({userId: dummyUserId, contentId: dummyContentId})
        .then((res) => {
            const { updated, type } = res.body;
            expect(updated.n).equals(1);
            expect(updated.nModified).equals(1);
            expect(updated.ok).equals(1);
            expect(type).equals('add');
            expect(res.status).equal(200);
            done();
        })
    })

    it('Remove liked content', (done) => {
        request(app).post(`${baseUrl}/like/content`)
        .send({userId: dummyUserId, contentId: dummyContentId})
        .then((res) => {
            const { updated, type } = res.body;
            expect(updated.n).equals(1);
            expect(updated.nModified).equals(1);
            expect(updated.ok).equals(1);
            expect(type).equals('remove');
            expect(res.status).equal(200);
            done();
        })
    })

    it('Add liked graph', (done) => {
        request(app).post(`${baseUrl}/like/graph`)
        .send({userId: dummyUserId, graphId: dummyGraphId})
        .then((res) => {
            const { updated, type } = res.body;
            expect(updated.n).equals(1);
            expect(updated.nModified).equals(1);
            expect(updated.ok).equals(1);
            expect(type).equals('add');
            expect(res.status).equal(200);
            done();
        })
    })

    it('Remove liked graph', (done) => {
        request(app).post(`${baseUrl}/like/graph`)
        .send({userId: dummyUserId, graphId: dummyGraphId})
        .then((res) => {
            const { updated, type } = res.body;
            expect(updated.n).equals(1);
            expect(updated.nModified).equals(1);
            expect(updated.ok).equals(1);
            expect(type).equals('remove');
            expect(res.status).equal(200);
            done();
        })
    })
})

describe('User Image', () => {
    it('Add User Image', (done) => {
        request(app).post(`${baseUrl}/image`)
        .send({username: dummyUser.username, image: dummyUser.image})
        .then((res) => {
            const { success } = res.body;
            expect(success).equals(true);
            expect(res.status).equal(200);
            done();
        })
    })

    it('Get User Image', (done) => {
        request(app).get(`${baseUrl}/${dummyUser.username}/image`)
        .send({})
        .then((res) => {
            const { image } = res.body;
            expect(image).equals(dummyUser.image);
            expect(res.status).equal(200);
            done();
        })
    })
})

describe('User Privacy', () => {
    it('Update User Privacy', (done) => {
        request(app).post(`${baseUrl}/privacy`)
        .send({userId: dummyUserId, privacy: true})
        .then((res) => {
            const { success } = res.body;
            expect(success).equals(true);
            expect(res.status).equal(200);
            done();
        })
    })
})

