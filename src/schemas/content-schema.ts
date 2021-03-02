import { Schema } from "mongoose";

export const contentSchema = new Schema({
    type: String,
    externalId: String,
    score: Number,
})