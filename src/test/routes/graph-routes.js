const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');


const graphController = require('../../controllers/graph-controller');
const userController = require('../../controllers/user-controller');
const dummyGraph = require('../dummyData').dummyGraph;

const baseUrl = '/graph'
let dummyGraphId;
let dummyUserId;

before(async () => {
  const {name, description, userId, tags} = dummyGraph;
  dummyGraphId = graphController.createNewGraph(name, description, userId, tags).toString();
  dummyUserId = userController.saveUserToDatabase('graphTest', 'graphTest');
});


describe('Fetch Graph data', () => {
    it('Get Graph by Id', (done) => {
        request(app).get(`${baseUrl}/${dummyGraphId}`)
        .send({})
        .then((res) => {
            const graph = res.body.graph;
            expect(graph.name).equal(dummyGraph.name)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Get Graph Views by query', (done) => {
        const query = "?name=Dummy&tags%5B%5D=Dummy%20Tag&page=1&pageSize=4"
        request(app).get(`${baseUrl}/views/${query}`)
        .send({})
        .then((res) => {
            const graph = res.body.graphViews[0];
            expect(graph.name).equal(dummyGraph.name)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Get Graph Views by query without Tags', (done) => {
        const query = "?name=Dummy&page=1&pageSize=4"
        request(app).get(`${baseUrl}/views/${query}`)
        .send({})
        .then((res) => {
            const graph = res.body.graphViews[0];
            expect(graph.name).equal(dummyGraph.name)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Get Graph Views by Ids', (done) => {
        request(app).post(`${baseUrl}/views`)
        .send({graphIds: [dummyGraphId]})
        .then((res) => {
            const graph = res.body.graphViews[0];
            expect(graph.name).equal(dummyGraph.name)
            expect(res.status).equal(200);
            done();
        })
    })
})

describe('Create and Updating Graph', () => {
    it('Create Graph', (done) => {
        request(app).post(`${baseUrl}/create`)
        .send({userId: dummyUserId, name: 'DummyGraphName',
                description: 'DummyDescription', tags: []})
        .then((res) => {
            const response = res.body.graphId;
            expect(response).exist;
            expect(res.status).equal(200);
            done();
        })
    })

    it('Create Graph with invalid data', (done) => {
        request(app).post(`${baseUrl}/create`)
        .send({})
        .then((res) => {
            const { errors } = res.body;
            expect(errors).length(3);
            expect(res.status).equal(400);
            done();
        })
    })

    it('Update Graph by Id', (done) => {
        request(app).post(`${baseUrl}/${dummyGraphId}`)
        .send({edges: [dummyGraph.edges], nodes: [dummyGraph.nodes], style: [], image: ''})
        .then((res) => {
            const response = res.body.res;
            expect(response.nModified).equal(1)
            expect(response.n).equal(1)
            expect(response.ok).equal(1)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Update Graph by empty nodes and edges', (done) => {
        request(app).post(`${baseUrl}/${dummyGraphId}`)
        .send({style: [], image: ''})
        .then((res) => {
            const response = res.body.res;
            expect(response.nModified).equal(1)
            expect(response.n).equal(1)
            expect(response.ok).equal(1)
            expect(res.status).equal(200);
            done();
        })
    })
})

describe('Graph Progress', () => {
    it('Add Graph to Progress', (done) => {
        request(app).post(`${baseUrl}/progress`)
        .send({graphId: dummyGraphId, userId: dummyUserId})
        .then((res) => {
            const response = res.body.res;
            expect(response).equal(true)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Add Graph to Progress with invalid data', (done) => {
        request(app).post(`${baseUrl}/progress`)
        .send({})
        .then((res) => {
            const { res: response } = res.body;
            expect(response).equal(false)
            expect(res.status).equal(400);
            done();
        })
    })

    it('Add Node to User Progress', (done) => {
        request(app).post(`${baseUrl}/progress/node`)
        .send({userId: dummyUserId, graphId: dummyGraphId, nodeId: dummyGraph.nodes[0].data.id})
        .then((res) => {
            const response = res.body.res;
            expect(response).equal(true)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Add Node to User Progress with invalid data', (done) => {
        request(app).post(`${baseUrl}/progress/node`)
        .send({})
        .then((res) => {
            const { res: response } = res.body;
            expect(response).equal(false)
            expect(res.status).equal(400);
            done();
        })
    })

    it('Remove Node From User Progress', (done) => {
        request(app).post(`${baseUrl}/progress/node/remove`)
        .send({userId: dummyUserId, graphId: dummyGraphId, nodeId: dummyGraph.nodes[0].data.id})
        .then((res) => {
            const response = res.body.res;
            expect(response).equal(true)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Remove Node From User Progress with Invalid Data', (done) => {
        request(app).post(`${baseUrl}/progress/node/remove`)
        .send({})
        .then((res) => {
            const { res: response } = res.body;
            expect(response).equal(false)
            expect(res.status).equal(400);
            done();
        })
    })

    it('Remove Graph Progress', (done) => {
        request(app).post(`${baseUrl}/progress/remove`)
        .send({graphId: dummyGraphId, userId: dummyUserId})
        .then((res) => {
            const response = res.body.res;
            expect(response).equal(true)
            expect(res.status).equal(200);
            done();
        })
    })


})

describe('Graph Style', () => {
    it('Update Graph style by Id', (done) => {
        request(app).post(`${baseUrl}/${dummyGraphId}/style`)
        .send({styleSheet: dummyGraph.styleSheet})
        .then((res) => {
            const response = res.body.res;
            expect(response.nModified).equal(1)
            expect(response.n).equal(1)
            expect(response.ok).equal(1)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Get Graph StyleSheet', (done) => {
        request(app).get(`${baseUrl}/${dummyGraphId}/style`)
        .send({})
        .then((res) => {
            const styleSheet = res.body.styleSheet[0];
            expect(styleSheet.selector).equal(dummyGraph.styleSheet[0].selector)
            expect(res.status).equal(200);
            done();
        })
    })
})


describe('Graph Privacy', () => {
    it('Update Graph privacy', (done) => {
        request(app).post(`${baseUrl}/${dummyGraphId}/privacy`)
        .send({privacy: true})
        .then((res) => {
            const response = res.body.success;
            expect(response).equal(true)
            expect(res.status).equal(200);
            done();
        })
    })
})