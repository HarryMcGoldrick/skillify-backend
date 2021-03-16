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

export const getGraphViewsFromDatabase = async (name, tags, page, pageSize) => {
    if (tags.length > 0) {
        return await graphModel.find({name: new RegExp(name), tags: {$in: [...tags]}}).skip((page-1) * pageSize).limit(pageSize);
    } else {
        return await graphModel.find({name: new RegExp(name)}).skip((page-1) * pageSize).limit(pageSize);
    } 

}

export const getGraphViewsCount = async (name, tags) => {
    if (tags.length > 0) {
        return await graphModel.find({name: new RegExp(name), tags: {$in: [...tags]}}).count();
    } else {
        return await graphModel.find({name: new RegExp(name)}).count();
    } 

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

export const getNodesFromGraph = async (graphId: string, nodeId: string) => {
    return await graphModel.find({ _id: new ObjectId(graphId), 'nodes.data.id': nodeId }, {'nodes.$': 1});
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

