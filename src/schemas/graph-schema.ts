import { Schema } from 'mongoose';

export const nodeSchema = new Schema({
    data: {
        id: String,
        label: String,
        description: String,
        completed: Boolean
    },
    position: {
        x: Number,
        y: Number
    }
})

const edgeSchema = new Schema({
    data: {
        id: String,
        source: String,
        target: String
    },
    position: {
        x: Number,
        y: Number
    }
})

export const graphSchema = new Schema({
    name: String,
    description: String,
    createdById: String,
    image: String,
    nodes: [nodeSchema],
    edges: [edgeSchema]
})
