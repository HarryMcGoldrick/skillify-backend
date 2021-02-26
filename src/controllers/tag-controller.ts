import { tagSchema } from '../schemas/tags-schema';
import { model } from 'mongoose';

const tagsModel = model('tags', tagSchema);

export const getContentTags = () => {
    return tagsModel.find({});
}

export const addContentTag = (tag: string) => {
    const tagsInstance = new tagsModel({tag});
    tagsInstance.save()
    return tagsInstance._id.toString();
}

export const addManyContentTags = (tagArray: any[]) => {
    return tagsModel.insertMany(tagArray)
}

export const deleteTag = (tag: string) => {
    return tagsModel.deleteOne({'tag': tag})
}