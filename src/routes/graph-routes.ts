import { Router } from 'express';
import { getGraphFromDatabase, createNewGraph, updateGraphInDatabase, getGraphViewsFromDatabase } from '../controllers/graph-controller';
import { body, param, validationResult } from 'express-validator';
import { authenticateToken } from '../utils/authentication';

const router = Router();


router.get('/views', async (req, res) => {
  const graphs = await getGraphViewsFromDatabase();
  const graphIds = graphs.map((graph: any) => {
    const {id, name } = graph
    return { id, name }
  })
  res.json(graphIds);
});

router.post('/', [body('name').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = createNewGraph(req.body.name);
    res.json({ graphId: id });
    res.status(200)
  });

router.get('/:id', [param('id').isAlphanumeric()], async (req, res) => {
  const graph = await getGraphFromDatabase(req.params.id);
  res.json({ graph });
  res.status(200)
})

router.post('/:id', [param('id').isAlphanumeric(), body('nodes').exists(), body('edges').exists()], async (req, res) => {
  const response = await updateGraphInDatabase(req.params.id, req.body);
  res.json({ res: response });
  res.status(200)
})

export default router;