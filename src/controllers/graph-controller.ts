import { graphSchema } from '../schemas/graph-schema';
import { model, Schema } from 'mongoose';

const graphModel = model('Graph', graphSchema);


export const saveGraphToDatabase = (body: any): string => {
    const graphInstance = new graphModel({edges: body.edges, nodes: body.nodes});
    graphInstance.save()
    return graphInstance._id.toString();
}

export const getGraphFromDatabase = async (id: string) => {
   return await graphModel.findById(id).exec();
}