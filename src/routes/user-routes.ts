import { generateJWT } from '../utils/authentication';
import { Router } from 'express'
import { body, validationResult } from 'express-validator';
import { isIfStatement } from 'typescript';
import { getHashedPassword, getUserFromDatabase, getUserGraphProgressionFromDatabase, getUserInfoFromDatabase, hasExistingUsername, saveUserToDatabase } from '../controllers/user-controller';
import { graphs_progressing } from '@/schemas/user-schema';

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

export default router;
