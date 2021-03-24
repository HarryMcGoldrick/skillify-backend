import { Router } from 'express';
import { getGraphFromDatabase, createNewGraph, updateGraphInDatabase, getGraphViewsFromDatabase, getGraphViewsCount, createImageFromGraphData, updateGraphStyleSheetInDatabase, getGraphsFromDatabase } from '../controllers/graph-controller';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../utils/authentication';
import { addGraphToUserCreated, addGraphToUserProgress, addNodeToUserProgress, getUserFromDatabase, removeGraphFromUserProgress, removeNodeFromUserProgress } from '../controllers/user-controller';

const router = Router();


router.get('/views', async (req, res) => {
  let {name, tags: tagsQuery, page, pageSize} : any = req.query;
  if (!tagsQuery) {
    tagsQuery = [];
  }
  const graphs = await getGraphViewsFromDatabase(name, tagsQuery, parseInt(page), parseInt(pageSize));
  const graphAmount = await getGraphViewsCount(name, tagsQuery);

  // Remove the unnecessary fields
  const graphViews = graphs.map((graph: any) => {
    const { id, name, description, createdById, image, tags } = graph
    return { id, name, description, createdById, image, tags }
  })

  res.json({graphViews, graphAmount});
});

router.post('/views', async (req, res) => {
  const { graphIds } = req.body;
  const graphs: any = await getGraphsFromDatabase(graphIds)

  const graphViews = graphs.map((graph: any) => {
    const { id, name, description, createdById, image, tags } = graph
    return { id, name, description, createdById, image, tags }
  })

  res.json({graphViews});
});

router.post('/create', [body('name').exists(), body('description').exists(), body('userId').exists(), authenticateToken], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId, name, description, tags } = req.body;
  const graphId = createNewGraph(name, description, userId, tags);
  await addGraphToUserCreated(graphId, userId);
  res.json({ graphId });
  res.status(200)
});

//TODO add validation to prevent same graph being added twice
router.post('/progress', authenticateToken, async (req, res) => {
  const { graphId, userId } = req.body;
  const response = await addGraphToUserProgress(graphId, userId);
  if (response) {
    res.json({ res: true });
    res.status(200)
  } else {
    res.json({ res: false });
    res.status(400)
  }
})

router.post('/progress/remove', authenticateToken, async (req, res) => {
  const { graphId, userId } = req.body;
  const response = await removeGraphFromUserProgress(graphId, userId);
  if (response) {
    res.json({ res: true });
    res.status(200)
  } else {
    res.json({ res: false });
    res.status(400)
  }
})

router.post('/progress/node', authenticateToken, async (req, res) => {
  const { graphId, userId, nodeId } = req.body;
  const response = await addNodeToUserProgress(userId, graphId, nodeId);
  if (response) {
    res.json({ res: true });
    res.status(200)
  } else {
    res.json({ res: false });
    res.status(400)
  }
})

router.post('/progress/node/remove', authenticateToken, async (req, res) => {
  const { graphId, userId, nodeId } = req.body;
  const response = await removeNodeFromUserProgress(userId, graphId, nodeId);
  if (response) {
    res.json({ res: true });
    res.status(200)
  } else {
    res.json({ res: false });
    res.status(400)
  }
})

router.get('/:id', [param('id').isAlphanumeric()], async (req, res) => {
  const graph: any = await getGraphFromDatabase(req.params.id);
  const {name, description, nodes, edges } = graph;
  const dataToReturn = {
    name,
    nodes,
    description,
    edges,
  }
  res.json({ graph: dataToReturn });
  res.status(200)
})

router.post('/:id', [param('id').isAlphanumeric(), authenticateToken], async (req, res) => {
  if (!req.body.nodes) {
    req.body.nodes = [];
  }
  if (!req.body.edges) {
    req.body.edges = [];
  }
  const response = await updateGraphInDatabase(req.params.id, req.body);
  res.json({ res: response });
  res.status(200)
})

router.post('/:id/style', [param('id').isAlphanumeric(), authenticateToken], async (req, res) => {
  const { styleSheet } = req.body;
  const response = await updateGraphStyleSheetInDatabase(req.params.id, styleSheet);
  res.json({ res: response });
  res.status(200)
})

router.get('/:id/style', [param('id').isAlphanumeric(), authenticateToken], async (req, res) => {
  const response: any = await getGraphFromDatabase(req.params.id);
  res.json({ styleSheet: response.styleSheet });
  res.status(200)
})

router.post('/:id/image', [param('id').isAlphanumeric(), authenticateToken], async (req, res) => {
  const response = createImageFromGraphData(req.params.id, req.body.elements);
  res.json({ res: response });
  res.status(200)
})



export default router;