process.env.NODE_ENV = 'test'
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const achievementController = require('../../controllers/achievement-controller');
let mongoServer;

const dummyAchievement = {
    type: 'Dummy Reward',
    name: 'Dummy Name',
    description: 'Dummy Description',
    rewardBadge: {
        type: 'Dummy Badge Type',
        name: 'Dummy Badge Name',
        color: 'Dummy Badge Color',
    },
    image: 'Dummy Image'
};

before(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri,  { useNewUrlParser: true,  useUnifiedTopology: true });
  await achievementController.addManyAchievements([dummyAchievement]);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});



describe('Achievements', () => {
    it('Get Achievements', (done) => {
        request(app).get('/achievement')
        .send({})
        .then((res) => {
            const achievement = res.body[0];
            expect(achievement.type).equal(dummyAchievement.type)
            expect(res.status).equal(200);
            done();
        })
    })

})