import { graphSchema } from '../schemas/graph-schema';
import { model } from 'mongoose';
import { ObjectId } from 'mongodb';
import * as cytosnap from 'cytosnap';
import * as dagre from 'cytoscape-dagre';
import * as cytoscape from 'cytoscape';

const graphModel = model('Graph', graphSchema);


export const createNewGraph = (name: string, description: string, createdById: string, tags: string[]): string => {
    const graphInstance = new graphModel({ name, description, createdById, tags });
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
    return await graphModel.updateOne({ _id: new ObjectId(id) }, { edges: body.edges, nodes: body.nodes, image: body.image, style: body.style})
}

export const updateGraphStyleSheetInDatabase = async (id: string, styleSheet: any): Promise<any> => {
    return await graphModel.updateOne({ _id: new ObjectId(id) }, { styleSheet })
}

export const overwriteGraphInDatabase = async (id: string, body: any): Promise<any> => {
    return await graphModel.replaceOne({ _id: new ObjectId(id) }, { edges: body.edges, nodes: body.nodes })
}

export const createImageFromGraphData = (id: string, elements: any) => {
    cytoscape.use(dagre)
    cytosnap.use(['cytoscape-dagre']);
    var snap = cytosnap();
    snap.start().then(function () {
        return snap.shot({
            elements: elements.elements,
            resolvesTo: 'base64uri',
            layout: {
                name: 'dagre'
            },
            format: 'png',
            width: 400,
            height: 200,
            background: 'transparent'
        });
    }).then(function (img) {
        return graphModel.updateOne({ _id: new ObjectId(id) }, { image: img })
    });
}

