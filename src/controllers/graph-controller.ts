import { graphSchema } from '../schemas/graph-schema';
import { model, Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

const graphModel = model('Graph', graphSchema);


export const saveGraphToDatabase = (body: any): string => {
    const graphInstance = new graphModel({edges: body.edges, nodes: body.nodes});
    graphInstance.save()
    return graphInstance._id.toString();
}

export const getGraphFromDatabase = async (id: string) => {
   return await graphModel.findById(id).exec();
}

export const getGraphIdsFromDatabase = async () => {
    return await graphModel.find({}).exec();
}

export const updateGraphInDatabase = async (id: string, body: any): Promise<any> => {
    return await graphModel.replaceOne({_id: new ObjectId(id)}, { edges: body.edges, nodes: body.nodes})
}
