import { addNodeObjectives, getObjectives, hasExistingObjectives, updateObjectives } from '../controllers/objective-controller';
import { Router } from 'express';

const router = Router();

router.get('/:userId/:nodeId', (req, res) => {
    const {userId, nodeId} = req.params;

    getObjectives(userId, nodeId).then((objectives) => {
        if (!objectives) {
            res.json({ error: "cannot find objectives" });
            res.status(400);
        } else {
            res.json({ items: objectives.items });
            res.status(200); 
        }
    })
})

router.post('/', (req, res) => {
    const {userId, nodeId, items} = req.body;


    hasExistingObjectives(userId, nodeId).then((exists => {
        if (!exists) {
            addNodeObjectives(userId, nodeId, items).then((updated) => {
                res.json({ updated, type: 'add' });
                res.status(200)
            }).catch((e) => {
                res.json({error: e}),
                res.status(400)
            })
        } else {
            updateObjectives(userId, nodeId, items).then((updated) => {
                res.json({ updated, type: 'update' });
                res.status(200)
            }).catch((e) => {
                res.json({error: e}),
                res.status(400)
            })
        }
    }))
})

export default router