import { Schema } from "mongoose";

const badgeSchema = new Schema({
    name: String,
    color: String,
})

const achievementSchema = new Schema({
    name: String,
    type: String,
    goal: String,
    rewardBadge: badgeSchema,
    image: String,
})

export const userAchievementSchema = new Schema({
    userId: Schema.Types.ObjectId,
    achievements: [achievementSchema],
    badges: [badgeSchema]
})