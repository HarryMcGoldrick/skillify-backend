import axios from 'axios';

export const youtubeRelatedSearch = async (searchQuery) => {
    return axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&key=${process.env.YT_API_KEY}`).then(({data}) => {
        return data;
    });
}