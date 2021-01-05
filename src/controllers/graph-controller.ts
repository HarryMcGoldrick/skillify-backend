import { graphSchema } from '../schemas/graph-schema';
import { model } from 'mongoose';
import { ObjectId } from 'mongodb';

const graphModel = model('Graph', graphSchema);


export const createNewGraph = (name: string, description: string): string => {
    const graphInstance = new graphModel({name, description});
    graphInstance.save()
    return graphInstance._id.toString();
}

export const getGraphFromDatabase = async (id: string) => {
   return await graphModel.findById(id).exec();
}

export const getGraphViewsFromDatabase = async () => {
    return await graphModel.find({}).exec();
}

export const updateGraphInDatabase = async (id: string, body: any): Promise<any> => {
    return await graphModel.updateOne({_id: new ObjectId(id)}, { edges: body.edges, nodes: body.nodes})
}

export const overwriteGraphInDatabase = async (id: string, body: any): Promise<any> => {
    return await graphModel.replaceOne({_id: new ObjectId(id)}, { edges: body.edges, nodes: body.nodes})
}
