import { objectiveSchema } from '../schemas/objective-schema';
import { model } from 'mongoose';
import { ObjectId } from 'mongodb';

const objectiveModel = model('objective', objectiveSchema);

export const hasExistingObjectives = async (userId: string, nodeId: string): Promise<any> => {
    return objectiveModel.exists({ userId: new ObjectId(userId), nodeId: nodeId})
}

export const getObjectives = async (userId: string, nodeId: string): Promise<any> => {
    return objectiveModel.findOne({ userId: new ObjectId(userId), nodeId: nodeId})
}

export const updateObjectives = async (userId: string, nodeId: string, items: any): Promise<any> => {
    return objectiveModel.updateOne({ userId: new ObjectId(userId), nodeId: nodeId}, { $set: { 'items': items }})
}

export const addNodeObjectives = async (userId: String, nodeId: String, items: any): Promise<any> => {
    const objectiveInstance = new objectiveModel({ userId, nodeId, items });
    objectiveInstance.save()
    return objectiveInstance._id.toString();
}