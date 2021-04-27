import { getGoogleBooksVolumeFromId, googleBooksRelatedSearch } from '../services/google-books';
import { Router } from 'express';
import { addContent, getContentForNodeId, getYoutubeVideosRelated, removeContent } from '../controllers/content-controller';
import { getYoutubeSnippetFromId } from '../services/youtube';

const router = Router();
 // Tests should ignore calling 3rd party end points 
 /* istanbul ignore next */ 
router.get('/youtube', async (req, res) => {
    const { searchQuery } = req.query
    const response = await getYoutubeVideosRelated(searchQuery);
    res.json({ response })
})
 /* istanbul ignore next */ 
router.get('/youtube/:id', async (req, res) => {
    const { id } = req.params;
    const response = await getYoutubeSnippetFromId(id);

    res.json({response});
})
 /* istanbul ignore next */ 
router.get('/googlebooks', async (req, res) => {
    const { searchQuery } = req.query
    const response = await googleBooksRelatedSearch(searchQuery);
    res.json({ response })
})
 /* istanbul ignore next */ 
router.get('/googlebooks/:id', async (req, res) => {
    const { id } = req.params;
    const response = await getGoogleBooksVolumeFromId(id);
    res.json({response});
})

// Adds content to the database
router.post('/', async (req, res) => {
    const { nodeId, content }= req.body;

    const response: any = await addContent(nodeId, content);

    res.json({response});
})

// Deletes a content given a contentId
router.delete('/:contentId', async (req, res) => {
    const { contentId } = req.params;
    const response: any = await removeContent(contentId);

    res.json({response});
})

// Gets all related content for a node
router.get('/:nodeId', async (req, res) => {
    const { nodeId } = req.params;
    const response: any = await getContentForNodeId(nodeId);
    if (response.length === 0) {
        res.status(400);
        res.json({error: 'Content fetch failed'});
    } else {
        res.status(200);
        res.json({ content: response })
    }
})

export default router;
