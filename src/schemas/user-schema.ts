import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';
import  { achievementSchema, badgeSchema } from './reward-schema';

//ToDo change casing to pascal
export const graphs_progressing = new Schema({
    graphId: ObjectId,
    completedNodes: [String]
})

export const userSchema = new Schema({
    username: String,
    password: String, // Password will be hashed
    graphs_created: Array,
    graphs_progressing: [graphs_progressing],
    likedContent: [ObjectId],
    achievements: [String],
    badges: [badgeSchema],
    image: String
})

