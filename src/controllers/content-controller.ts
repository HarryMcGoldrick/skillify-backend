import { youtubeRelatedSearch } from '../services/youtube';
import { graphSchema } from '../schemas/graph-schema';
import { model } from 'mongoose';
import { ObjectId } from 'mongodb';

const graphModel = model('Graph', graphSchema);

export const getYoutubeVideosRelated = (label) => {
    return youtubeRelatedSearch(label);
}

export const addContentToNode = async (graphId: string, nodeId: string, content: any) => {
    return await graphModel.updateOne({ _id: new ObjectId(graphId), 'nodes.data.id': nodeId }, {$push: {'nodes.$.data.content': content}});
}

export const removeContentFromNode = async (graphId: string, nodeId: string, contentId: string) => {
    return await graphModel.update({ _id: new ObjectId(graphId), 'nodes.data.id': nodeId }, { $pull: { 'nodes.$.data.content': {_id: new ObjectId(contentId) }} });
}

export const incrementContentScore = async (graphId: string, nodeId: string, contentId: string) => {
    return await graphModel.updateOne({ _id: new ObjectId(graphId)}, {
        $inc : {
          'nodes.$[node_id].content.$[content_id].score' : +1
        }
      }, {
        arrayFilters : [{ 'nodes._id' : nodeId }, { 'content._id' : new ObjectId(contentId) }]
      });
}

export const decerementContentScore = async (graphId: string, nodeId: string, contentId: string) => {
    return await graphModel.update({ _id: new ObjectId(graphId), 'nodes.data.id': nodeId }, { $inc: { score: -1} });
}
