import { Hash } from 'crypto';
import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

export const graphs_progressing = new Schema({
    graphId: ObjectId,
    completedNodes: [String]
})

export const userSchema = new Schema({
    username: String,
    password: String, // Password will be hashed
    graphs_created: Array,
    graphs_progressing: [graphs_progressing]
})

