import axios from 'axios';

export const googleBooksRelatedSearch = async (searchQuery: any) => {
    return axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${process.env.GOOGLE_API_KEY}&maxResults=2`).then(res => res.data);
}

export const getGoogleBooksVolumeFromId = async (volumeId: string) => {
    return axios.get(`https://www.googleapis.com/books/v1/volumes/${volumeId}?key=${process.env.GOOGLE_API_KEY}`).then(res => res.data);
}