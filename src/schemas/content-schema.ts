import { Schema } from "mongoose";

export const contentSchema = new Schema({
    nodeId: String,
    type: String,
    externalId: String,
    score: Number,
})