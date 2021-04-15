import { generateJWT } from '../utils/authentication';
import { Router } from 'express'
import { body, validationResult } from 'express-validator';
import { getHashedPassword, getUserFromDatabase, getUserGraphProgressionFromDatabase,
        getUserInfoFromDatabase, hasExistingUsername, saveUserToDatabase, 
         hasLikedContent, addLikedContent, removeLikedContent, addImage, updateUserPrivacy,
         getUserInfoFromDatabaseByUsername } from '../controllers/user-controller';
import { decerementContentScore, incrementContentScore } from '../controllers/content-controller';
import { getCompletedNodeCount } from '../utils/achievements';

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
            const completedNodeCount = getCompletedNodeCount(user)
            res.json({ username: user.username, graphs_created: user.graphs_created, likedContent: user.likedContent, 
                    achievements: user.achievements, badges: user.badges, completedNodeCount, graphs_progressing: user.graphs_progressing});
            res.status(200)
        }
    })

});

router.post('/userinfo', (req, res) => {
    const { username } = req.body;

    getUserInfoFromDatabaseByUsername(username).then((user) => {
        if (!user) {
            res.json({ error: "cannot find user" });
            res.status(400)
        } else {
            const completedNodeCount = getCompletedNodeCount(user)
            res.json({ userId: user._id, username: user.username, graphs_created: user.graphs_created, likedContent: user.likedContent, 
                    achievements: user.achievements, badges: user.badges, completedNodeCount, graphs_progressing: user.graphs_progressing,
                    private: user.private});
            res.status(200)
        }
    })
})

router.post('/progress', (req, res) => {
    const { userId, graphId } = req.body;

    getUserGraphProgressionFromDatabase(userId, graphId).then((user => {
        if (!user) {
            res.json({ error: "cannot find user" });
            res.status(400)
        } else {
            const filteredGraphs = user.graphs_progressing.filter(graph => {
                if (graph._id.toString() === graphId) {
                    return true
                }
            })[0]
            const { completedNodes } = filteredGraphs
            res.json({completedNodes});
            res.status(200)
        }
    }))
})


router.post('/content', (req, res) => {
    const { userId, contentId} = req.body;
    
    hasLikedContent(userId, contentId).then((exists => {
        if (!exists) {
            incrementContentScore(contentId);
            addLikedContent(userId, contentId).then((updated) => {
                res.json({ updated, type: 'add' });
                res.status(200)
            }).catch((e) => {
                res.json({error: e}),
                res.status(400)
            })
        } else {
            decerementContentScore(contentId);
            removeLikedContent(userId, contentId).then((updated) => {
                res.json({ updated, type: 'remove' });
                res.status(200)
            }).catch((e) => {
                res.json({error: e}),
                res.status(400)
            })
        }
    }))
})

router.post('/image', (req, res) => {
    const { username, image } = req.body;
    
    addImage(username, image).then((updated) => {
        if (updated.nModified === 1) {
            res.json({ success: true });
            res.status(200)
        }
    }).catch((e) => {
        res.json({error: e}),
        res.status(400)
    })
})

router.get('/:username/image', (req, res) => {
    const { username } = req.params;
    console.log(username)
    
    getUserInfoFromDatabaseByUsername(username).then((user) => {
        console.log(user);
        res.json({ image: user.image });
        res.status(200)
    }).catch((e) => {
        res.json({error: e}),
        res.status(400)
    })
})

router.post('/privacy', (req , res) => {
    const { userId, privacy } = req.body;
    
    updateUserPrivacy(userId, privacy).then(() => {
        res.json({ success: true });
        res.status(200)
    }).catch((e) => {
        res.json({error: e}),
        res.status(400)
    })
})

export default router;
