import { Schema } from 'mongoose';

const nodeSchema = new Schema({
    data: {
        id: String,
        label: String
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
    nodes: [nodeSchema],
    edges: [edgeSchema]
})
