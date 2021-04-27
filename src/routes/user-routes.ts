import { generateJWT } from '../utils/authentication';
import { Router } from 'express'
import { body, validationResult } from 'express-validator';
import { getHashedPassword, getUserFromDatabase, getUserGraphProgressionFromDatabase,
        getUserInfoFromDatabase, hasExistingUsername, saveUserToDatabase, 
         hasLikedContent, addLikedContent, removeLikedContent, addImage, updateUserPrivacy,
         getUserInfoFromDatabaseByUsername, addLikedGraph, removeLikedGraph, hasLikedGraph } from '../controllers/user-controller';
import { decerementContentScore, incrementContentScore } from '../controllers/content-controller';
import { getCompletedNodeCount } from '../utils/achievements';
import { decerementGraphScore, incrementGraphScore } from '../controllers/graph-controller';

const router = Router();

// Registers a user and checks that the username is unique
router.post('/register', [body('username').exists(), body('password').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    hasExistingUsername(username).then((exists) => {
        if (exists) {
            res.status(200)
            res.json({ error: "username already exists" });
        } else {
            const id = saveUserToDatabase(username, hashedPassword);
            res.status(200)
            res.json({ userId: id });
        }
    });
});

// Validates the users information and returns a JWT token if valid
router.post('/login', [body('username').exists(), body('password').exists()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = getHashedPassword(password);
    getUserFromDatabase(username, hashedPassword).then((user) => {
        if (!user) {
            res.status(400)
            res.json({ error: "cannot find user" });
        } else {
            const token = generateJWT(user._id, user.username).toString()
            res.status(200)
            res.json({ token });
        }
    })

});

// Returns the users information for a given Id
router.get('/:id/userinfo', (req, res) => {
    const { id: userId } = req.params

    getUserInfoFromDatabase(userId).then((user) => {
        if (!user) {
            res.status(400)
            res.json({ error: "cannot find user" });
        } else {
            const completedNodeCount = getCompletedNodeCount(user)
            res.status(200)
            res.json({ username: user.username, graphs_created: user.graphs_created, likedContent: user.likedContent, 
                    achievements: user.achievements, badges: user.badges, completedNodeCount, graphs_progressing: user.graphs_progressing,
                    likedGraphs: user.likedGraphs});
        }
    })

});

// Returns the users information for a given username
router.post('/userinfo', (req, res) => {
    const { username } = req.body;

    getUserInfoFromDatabaseByUsername(username).then((user) => {
        if (!user) {
            res.status(400)
            res.json({ error: "cannot find user" });
        } else {
            const completedNodeCount = getCompletedNodeCount(user)
            res.status(200)
            res.json({ userId: user._id, username: user.username, graphs_created: user.graphs_created, likedContent: user.likedContent, 
                    achievements: user.achievements, badges: user.badges, completedNodeCount, graphs_progressing: user.graphs_progressing,
                    private: user.private});
        }
    })
})

// Retrieves the current progress for a graph
router.post('/progress', (req, res) => {
    const { userId, graphId } = req.body;

    getUserGraphProgressionFromDatabase(userId, graphId).then((user => {
        if (!user) {
            res.status(400);
            res.json({ error: "cannot find user" });
        } else {
            const filteredGraphs = user.graphs_progressing.filter(graph => {
                if (graph._id.toString() === graphId) {
                    return true
                }
            })[0]
            const completedNodes = filteredGraphs ? filteredGraphs.completedNodes : []
            res.status(200);
            res.json({completedNodes});
        }
    }))
})

// Updates the liked status of a user suggested content
router.post('/like/content', (req, res) => {
    const { userId, contentId} = req.body;
    hasLikedContent(userId, contentId).then((exists => {
        if (!exists) {
            incrementContentScore(contentId);
            addLikedContent(userId, contentId).then((updated) => {
                res.status(200);
                res.json({ updated, type: 'add' });
            }).catch((e) => {
                res.status(400);
                res.json({error: e});
            })
        } else {
            decerementContentScore(contentId);
            removeLikedContent(userId, contentId).then((updated) => {
                res.status(200);
                res.json({ updated, type: 'remove' });
            }).catch((e) => {

                res.status(400);
                res.json({error: e});
            })
        }
    }))
})

// Updates the like status for a user created graph
router.post('/like/graph', (req, res) => {
    const { userId, graphId } = req.body;
    hasLikedGraph(userId, graphId).then((exists => {
        if (!exists) {
            incrementGraphScore(graphId);
            addLikedGraph(userId, graphId).then((updated) => {
                res.status(200);
                res.json({ updated, type: 'add' });
            }).catch((e) => {
                res.status(400);
                res.json({error: e});
            })
        } else {
            decerementGraphScore(graphId);
            removeLikedGraph(userId, graphId).then((updated) => {
                res.status(200);
                res.json({ updated, type: 'remove' });
            }).catch((e) => {
                res.status(400);
                res.json({error: e});
            })
        }
    }))
})

// Adds a user avatar
router.post('/image', (req, res) => {
    const { username, image } = req.body;
    
    addImage(username, image).then((updated) => {
        if (updated.nModified === 1) {
            res.status(200);
            res.json({ success: true });
        }
    }).catch((e) => {
        res.status(400);
        res.json({error: e});
    })
})

// Get user image by username
router.get('/:username/image', (req, res) => {
    const { username } = req.params;
    
    getUserInfoFromDatabaseByUsername(username).then((user) => {
        res.status(200);
        res.json({ image: user.image });
    }).catch((e) => {
        res.status(400);
        res.json({error: e});
    })
})

// Update the privacy setting for a user
router.post('/privacy', (req , res) => {
    const { userId, privacy } = req.body;
    
    updateUserPrivacy(userId, privacy).then(() => {
        res.status(200);
        res.json({ success: true });
    }).catch((e) => {
        res.status(400);
        res.json({error: e});
    })
})

export default router;
