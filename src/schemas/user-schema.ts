import { ObjectId } from 'mongodb';
import { Schema } from 'mongoose';

const taskItem = new Schema({
    label: String,
    checked: Boolean,
    id: Number,
})

export const nodeObjective = new Schema({
    nodeId: String,
    items: [taskItem]
})

//ToDo change casing to pascal
export const graphs_progressing = new Schema({
    graphId: ObjectId,
    completedNodes: [String],
    nodeObjectives: [nodeObjective]
})

export const userSchema = new Schema({
    username: String,
    password: String, // Password will be hashed
    graphs_created: Array,
    graphs_progressing: [graphs_progressing],
    likedContent: [ObjectId]
})

