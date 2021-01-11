import { createHash, Hash } from 'crypto';
import { ObjectId } from 'mongodb';
import { model } from 'mongoose';
import { userSchema, graphs_progressing } from '../schemas/user-schema';

const userModel = model('User', userSchema);


export const getHashedPassword = (password: string): string => {
    const sha256 = createHash('SHA256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

export const saveUserToDatabase = (username: string, password: string): string => {
    const userInstance = new userModel({ username, password });
    userInstance.save();
    return userInstance._id;
}

export const hasExistingUsername = async (username: string): Promise<boolean> => {
    return userModel.exists({ username });
}

export const getUserFromDatabase = async (username: string, password: string): Promise<any> => {
    return userModel.findOne({ username, password });
}

export const addGraphToUserCreated = async (graphId: string, userId: string): Promise<any> => {
    return userModel.findByIdAndUpdate({ _id: new ObjectId(userId) }, { $push: { graphs_created: new ObjectId(graphId) } });
}

export const addGraphToUserProgress = async (graphId: string, userId: string): Promise<any> => {
    return userModel.findByIdAndUpdate({ _id: new ObjectId(userId) }, { $push: { graphs_progressing: { _id: new ObjectId(graphId) } } });
}

export const addNodeToUserProgress = async (userId: string, graphId: string, nodeId: string): Promise<any> => {
    return userModel.updateOne({ _id: new ObjectId(userId), 'graphs_progressing._id': new ObjectId(graphId) }, { $push: { 'graphs_progressing.$.completedNodes': nodeId } })
}

export const removeGraphFromUserProgress = async (graphId: string, userId: string): Promise<any> => {
    return userModel.findByIdAndUpdate({ _id: new ObjectId(userId) }, { $pull: { graphs_progressing: { _id: new ObjectId(graphId) } } });
}

export const removeNodeFromUserProgress = async (userId: string, graphId: string, nodeId: string): Promise<any> => {
    return userModel.updateOne({ _id: new ObjectId(userId), 'graphs_progressing._id': new ObjectId(graphId) }, { $pull: { 'graphs_progressing.$.completedNodes': nodeId } })
}

export const getUserInfoFromDatabase = async (userId: string): Promise<any> => {
    return userModel.findById(new ObjectId(userId));
}