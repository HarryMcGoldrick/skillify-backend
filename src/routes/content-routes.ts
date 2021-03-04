import { getGoogleBooksVolumeFromId, googleBooksRelatedSearch } from '../services/google-books';
import { Router } from 'express';
import { addContent, getContentForNodeId, getYoutubeVideosRelated, removeContent } from '../controllers/content-controller';
import { getYoutubeSnippetFromId } from '../services/youtube';

const router = Router();


router.get('/youtube', async (req, res) => {
    const { searchQuery } = req.query
    const response = await getYoutubeVideosRelated(searchQuery);
    res.json({response })
})

router.get('/youtube/:id', async (req, res) => {
    const { id } = req.params;
    const response = await getYoutubeSnippetFromId(id);

    res.json({response});
})

router.get('/googlebooks', async (req, res) => {
    const { searchQuery } = req.query
    const response = await googleBooksRelatedSearch(searchQuery);
    res.json({ response })
})

router.get('/googlebooks/:id', async (req, res) => {
    const { id } = req.params;
    const response = await getGoogleBooksVolumeFromId(id);
    res.json({response});
})

router.post('/', async (req, res) => {
    const { nodeId, content}= req.body;

    const response: any = await addContent(nodeId, content);

    res.json({response});
})

router.delete('/:contentId', async (req, res) => {
    const { contentId } = req.params;
    const response: any = await removeContent(contentId);

    res.json({response});
})

router.get('/:nodeId', async (req, res) => {
    const { nodeId } = req.params;
    const response: any = await getContentForNodeId(nodeId);
    if (!response) {
        res.json({error: 'Content fetch failed'});
    } else {
        res.json({ content: response })
    }
})

export default router;
