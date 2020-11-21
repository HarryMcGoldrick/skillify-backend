import { generateJWT } from '../utils/authentication';
import { Router } from 'express'
import { body, validationResult } from 'express-validator';
import { isIfStatement } from 'typescript';
import { getHashedPassword, getUserFromDatabase, hasExistingUsername, saveUserToDatabase } from '../controllers/user-controller';

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
            res.json({ error: "username already exists"});
            res.status(200)
        } else {
            const id = saveUserToDatabase(username, hashedPassword);
            res.json({ userId: id});
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
            res.json({ error: "cannot find user"});
            res.status(400)
        } else {
            const token = generateJWT(username).toString()
            res.json({ token });
            res.status(200)
        }
    })

});

export default router;
