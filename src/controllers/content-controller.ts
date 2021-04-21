import { youtubeRelatedSearch } from '../services/youtube';
import { model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { contentSchema } from '../schemas/content-schema';

const contentModel = model('Content', contentSchema)

export const getYoutubeVideosRelated = (label) => {
    return youtubeRelatedSearch(label);
}

export const addContent = (nodeId: string, content: any) => {
    const contentInstance = new contentModel({ nodeId, ...content });
    contentInstance.save()
    return contentInstance._id.toString();
}

export const removeContent = async (contentId: string) => {
    return await contentModel.deleteOne({_id: new ObjectId(contentId)});
}

export const incrementContentScore = async (contentId: string) => {
    return await contentModel.updateOne({_id: new ObjectId(contentId)}, {$inc: {score: +1}})
}

export const decerementContentScore = async (contentId: string) => {
  return await contentModel.updateOne({_id: new ObjectId(contentId)}, {$inc: {score: -1}})
}

export const getContentForNodeId = async (nodeId: string) => {
  return await contentModel.find({nodeId: nodeId});
}