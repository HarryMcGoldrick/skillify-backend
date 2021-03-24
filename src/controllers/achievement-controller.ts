import { achievementSchema } from '../schemas/reward-schema';
import { model } from 'mongoose';

const achievementModel = model('achievements', achievementSchema);

export const getAchievements = () => {
    return achievementModel.find({});
}

export const addManyAchievements = (achievementArray) => {
    return achievementModel.insertMany(achievementArray)
}

export const getAchievementFromName = (achievementNames) => {
    return achievementModel.find({name: {$in: achievementNames}})
}