import { getNodesFromGraph } from '../controllers/graph-controller';
import { Router } from 'express';
import { addContentToNode, getYoutubeVideosRelated, removeContentFromNode } from '../controllers/content-controller';
import { getYoutubeSnippetFromId } from '../services/youtube';

const router = Router();


router.get('/youtube', async (req, res) => {
    const { label } = req.query
    const response = await getYoutubeVideosRelated(label);
    res.json({response })
})

router.get('/youtube/:id', async (req, res) => {
    const { id } = req.params;
    const response = await getYoutubeSnippetFromId(id);

    res.json({response});
})

router.post('/', async (req, res) => {
    const { graphId, nodeId, content}= req.body;

    const response: any = await addContentToNode(graphId, nodeId, content);

    res.json({response});
})

router.delete('/', async (req, res) => {
    const { graphId, nodeId, contentId}= req.body;
    const response: any = await removeContentFromNode(graphId, nodeId, contentId);

    res.json({response});
})

router.get('/:graphId/:nodeId', async (req, res) => {
    const { graphId, nodeId } = req.params;
    let content = [];
    const response: any = await getNodesFromGraph(graphId, nodeId);
    const graph = response.pop();
    if (graph) {
        graph.nodes.map((node) => {
            if (node.data.id.toString() === nodeId) {
                content = node.data.content;
            }
        })
    } else {
        res.json({error: 'Content fetch failed'});
    }
    res.json({ content })
})

export default router;
