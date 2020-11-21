import { Hash } from 'crypto';
import { Schema } from 'mongoose';

export const userSchema = new Schema({
    username: String,
    password: String // Password will be hashed
})