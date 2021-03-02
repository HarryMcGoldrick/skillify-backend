import { Schema } from 'mongoose';
import { contentSchema } from './content-schema';


export const nodeSchema = new Schema({
    data: {
        id: String,
        label: String,
        description: String,
        completed: Boolean,
        content: [contentSchema]
    },
    position: {
        x: Number,
        y: Number
    },
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

const style = new Schema({
    selector: String,
    style: Schema.Types.Mixed
})

export const graphSchema = new Schema({
    name: String,
    description: String,
    createdById: String,
    image: String,
    nodes: [nodeSchema],
    edges: [edgeSchema],
    styleSheet: [style],
    tags: [String],
})
