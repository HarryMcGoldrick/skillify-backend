import { youtubeRelatedSearch } from '../services/youtube';

export const getYoutubeVideosRelated = (label) => {
    return youtubeRelatedSearch(label);
}