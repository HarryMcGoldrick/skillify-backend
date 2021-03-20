import { ObjectId } from 'mongodb';

import { Mongoose, Schema } from 'mongoose';

const taskItem = new Schema({
    label: String,
    checked: Boolean,
    id: Number,
})

export const objectiveSchema = new Schema({
    userId: Schema.Types.ObjectId,
    nodeId: String,
    items: [taskItem]
})
