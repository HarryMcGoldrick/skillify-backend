// Dont run test coverage for external services
/* istanbul ignore file */
import axios from 'axios';

export const youtubeRelatedSearch = async (searchQuery: string) => {
    return axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&safeSearch=strict&q=${searchQuery}&key=${process.env.GOOGLE_API_KEY}`).then(res => res.data);
}

export const getYoutubeSnippetFromId = async (videoId: string) => {
    return axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`).then(res => res.data);
}