const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app.ts');

const achievementController = require('../../controllers/achievement-controller');
const userController = require('../../controllers/user-controller');

const baseUrl = '/achievement'
let dummyUserId;

before(async () => {
  dummyUserId = userController.saveUserToDatabase('graphTest', 'graphTest');
});

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
  await achievementController.addManyAchievements([dummyAchievement]);
});

describe('Achievements', () => {
    it('Get Achievements', (done) => {
        request(app).get(baseUrl)
        .send({})
        .then((res) => {
            const achievement = res.body[0];
            expect(achievement.type).equal(dummyAchievement.type)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Get Achievements By Name', (done) => {
        request(app).post(`${baseUrl}/objects`)
        .send({achievementNames: [dummyAchievement.name]})
        .then((res) => {
            const achievement = res.body[0];
            expect(achievement.type).equal(dummyAchievement.type)
            expect(res.status).equal(200);
            done();
        })
    })

    it('Poll User Achievements', (done) => {
        request(app).get(`${baseUrl}/poll/${dummyUserId}`)
        .send({})
        .then((res) => {
            const achievementsAdded = res.body;
            expect(achievementsAdded).length(0)
            expect(res.status).equal(200);
            done();
        })
    })
})