import { generateJWT } from '../utils/authentication';
import { Router } from 'express'
import { body, validationResult } from 'express-validator';
import { addNodeObjectives, getHashedPassword, getUserFromDatabase, getUserGraphProgressionFromDatabase, getUserInfoFromDatabase, hasExistingNodeObjectives, hasExistingUsername, saveUserToDatabase, updateNodeObjectives, getNodeObjectives} from '../controllers/user-controller';
import { nodeObjective } from '@/schemas/user-schema';

const router = Router();

router.post('/register', [body('username').exists(), body('password').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    hasExistingUsername(username).then((exists) => {
        if (exists) {
            res.json({ error: "username already exists" });
            res.status(200)
        } else {
            const id = saveUserToDatabase(username, hashedPassword);
            res.json({ userId: id });
            res.status(200)
        }
    });
});

router.post('/login', [body('username').exists(), body('password').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    getUserFromDatabase(username, hashedPassword).then((user) => {
        if (!user) {
            res.json({ error: "cannot find user" });
            res.status(400)
        } else {
            const token = generateJWT(user._id, user.username).toString()
            res.json({ token });
            res.status(200)
        }
    })

});


router.get('/:id/userinfo', (req, res) => {
    const { id: userId } = req.params

    getUserInfoFromDatabase(userId).then((user) => {
        if (!user) {
            res.json({ error: "cannot find user" });
            res.status(400)
        } else {
            res.json({ username: user.username, graphs_created: user.graphs_created });
            res.status(200)
        }
    })

});

router.post('/progress', (req, res) => {
    const { userId, graphId } = req.body;

    getUserGraphProgressionFromDatabase(userId, graphId).then((user => {
        if (!user) {
            res.json({ error: "cannot find user" });
            res.status(400)
        } else {
            const completedNodes = user.graphs_progressing.map(graph => {
                if (graph._id.toString() === graphId) {
                    return graph.completedNodes
                }
            })[0]
            res.json({completedNodes});
            res.status(200)
        }
    }))
})

router.get('/objectives/:graphId/:userId/:nodeId', (req, res) => {
    const {userId, graphId, nodeId} = req.params;

    getNodeObjectives(userId, graphId, nodeId).then((user) => {
        if (!user) {
            res.json({ error: "cannot find objectives" });
            res.status(400);
        } else {
            const graph = user.graphs_progressing.map(obj => {
                if (obj._id.toString() === graphId) {
                    return obj;
                } 
            });
            const nodeObjectives = graph.map(items => {
                return items.nodeObjectives.filter(obj => {
                    if (obj.nodeId.toString() === nodeId) {
                        return obj;
                    }
                })
            })[0]
            res.json({objectives: nodeObjectives});
            res.status(200);
        }
    })
})

router.post('/objectives', (req, res) => {
    const {userId, graphId, nodeObjectives} = req.body;

    const { nodeId } = nodeObjectives;

    hasExistingNodeObjectives(userId, graphId, nodeId).then((exists => {
        if (!exists) {
            addNodeObjectives(userId, graphId, nodeObjectives).then((updated) => {
                res.json({ updated, type: 'add' });
                res.status(200)
            }).catch((e) => {
                res.json({error: e}),
                res.status(400)
            })
        } else {
            updateNodeObjectives(userId, graphId, nodeId, nodeObjectives).then((updated) => {
                res.json({ updated, type: 'update' });
                res.status(200)
            }).catch((e) => {
                res.json({error: e}),
                res.status(400)
            })
        }
    }))
})

export default router;
