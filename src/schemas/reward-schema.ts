import { Schema } from "mongoose";

export const badgeSchema = new Schema({
    type: String,
    name: String,
    color: String,
})

export const achievementSchema = new Schema({
    type: String,
    name: String,
    goal: String,
    rewardBadge: badgeSchema,
    image: String,
})