import { Router } from 'express';
import { getGraphFromDatabase, createNewGraph, updateGraphInDatabase, getGraphViewsFromDatabase, getGraphViewsCount, createImageFromGraphData, updateGraphStyleSheetInDatabase, getGraphsFromDatabase, updateGraphPrivacy } from '../controllers/graph-controller';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../utils/authentication';
import { addGraphToUserCreated, addGraphToUserProgress, addNodeToUserProgress, getUserFromDatabase, removeGraphFromUserProgress, removeNodeFromUserProgress } from '../controllers/user-controller';

const router = Router();

// Queries the database for graphs with match the given query string
// Returns a list of limited graph data to increase performance when querying for large amounts of graphs
router.get('/views', async (req, res) => {
  let {name, tags: tagsQuery, page, pageSize} : any = req.query;
  if (!tagsQuery) {
    tagsQuery = [];
  }
  const graphs = await getGraphViewsFromDatabase(name, tagsQuery, parseInt(page), parseInt(pageSize));
  const graphAmount = await getGraphViewsCount(name, tagsQuery);

  // Remove the unnecessary fields
  const graphViews = graphs.map((graph: any) => {
    const { id, name, description, createdById, image, tags, private: privacy, score } = graph
    return { id, name, description, createdById, image, tags, private: privacy, score}
  })
  
  res.json({graphViews, graphAmount});
});

// Returns a list of limited graph data that match the Ids provided
router.post('/views', async (req, res) => {
  const { graphIds } = req.body;
  const graphs: any = await getGraphsFromDatabase(graphIds)

  const graphViews = graphs.map((graph: any) => {
    const { id, name, description, createdById, image, tags } = graph
    return { id, name, description, createdById, image, tags }
  })

  res.json({graphViews});
});

// Creates a new graph in the database
router.post('/create', [body('name').exists(), body('description').exists(), body('userId').exists(), authenticateToken], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userId, name, description, tags } = req.body;
  const graphId = createNewGraph(name, description, userId, tags);
  await addGraphToUserCreated(graphId, userId);
  res.status(200)
  res.json({ graphId });
});

//Intiiates progress mode for a graph
router.post('/progress', authenticateToken, async (req, res) => {
  const { graphId, userId } = req.body;
  const response = await addGraphToUserProgress(graphId, userId);
  if (response.nModified === 1) {
    res.status(200);
    res.json({ res: true });
  } else {
    res.status(400);
    res.json({ res: false });
  }
})

//Removes graph from progress mode
router.post('/progress/remove', authenticateToken, async (req, res) => {
  const { graphId, userId } = req.body;
  const response = await removeGraphFromUserProgress(graphId, userId);
  if (response) {
    res.status(200)
    res.json({ res: true });
  } else {
    res.status(400)
    res.json({ res: false });
  }
})

// Adds a node to the current graphs progress
router.post('/progress/node', authenticateToken, async (req, res) => {
  const { graphId, userId, nodeId } = req.body;
  const response = await addNodeToUserProgress(userId, graphId, nodeId);
  if (response.nModified === 1) {
    res.status(200)
    res.json({ res: true });
  } else {
    res.status(400)
    res.json({ res: false });
  }
})

// Removes a node to the current graphs progress
router.post('/progress/node/remove', authenticateToken, async (req, res) => {
  const { graphId, userId, nodeId } = req.body;
  const response = await removeNodeFromUserProgress(userId, graphId, nodeId);
  if (response.nModified) {
    res.status(200)
    res.json({ res: true });
  } else {
    res.status(400)
    res.json({ res: false });
  }
})

// Returns graph data for a given Id
router.get('/:id', [param('id').isAlphanumeric()], async (req, res) => {
  const graph: any = await getGraphFromDatabase(req.params.id);
  const {name, description, nodes, edges, private: privacy } = graph;
  const dataToReturn = {
    name,
    nodes,
    description,
    edges,
    private: privacy,
  }
  res.json({ graph: dataToReturn });
  res.status(200)
})

// Updates the graph data for a given Id
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

// Updates the style of a graph for a given Id
router.post('/:id/style', [param('id').isAlphanumeric(), authenticateToken], async (req, res) => {
  const { styleSheet } = req.body;
  const response = await updateGraphStyleSheetInDatabase(req.params.id, styleSheet);
  res.json({ res: response });
  res.status(200)
})

// Returns the stylesheet for a graph Id
router.get('/:id/style', [param('id').isAlphanumeric()], async (req, res) => {
  const response: any = await getGraphFromDatabase(req.params.id);
  res.json({ styleSheet: response.styleSheet });
  res.status(200)
})

// Creates an image server side for a graphId
router.post('/:id/image', [param('id').isAlphanumeric(), authenticateToken], async (req, res) => {
  const response = createImageFromGraphData(req.params.id, req.body.elements);
  res.json({ res: response });
  res.status(200)
})

// Updates the privacy setting for a graph
router.post('/:id/privacy', [param('id').isAlphanumeric(), authenticateToken], async (req , res) => {
  const { id: graphId } = req.params;
  const { privacy } = req.body;
  updateGraphPrivacy(graphId, privacy).then(() => {
      res.json({ success: true });
      res.status(200)
  }).catch((e) => {
      res.json({error: e}),
      res.status(400)
  })
})



export default router;