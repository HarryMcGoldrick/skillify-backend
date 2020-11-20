import { Router } from "express";
import { getGraphFromDatabase, saveGraphToDatabase } from "../controllers/graph-controller";
import { body, param, validationResult } from "express-validator";

const router = Router();

router.post('/', [body('nodes').exists(), body('edges').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = saveGraphToDatabase(req.body);
    res.json({ graphId: id });
    res.status(200)
  });

router.get('/:id', [param('id').isAlphanumeric()], async (req, res) => {
  const graph = await getGraphFromDatabase(req.params.id);
  res.json({ graph });
  res.status(200)
})

export default router;