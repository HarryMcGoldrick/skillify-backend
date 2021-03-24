import { getAchievementFromName, getAchievements } from '../controllers/achievement-controller';
import { Router } from 'express';
import { checkForAchievements } from '../utils/achievements';

const router = Router();

router.get('/', async (req, res) => {
  const achievements = await getAchievements();
  res.json(achievements);
  res.status(200)
})

router.get('/poll/:userId', async (req, res) => {
    const { userId } = req.params;
    const achievementsAdded = await checkForAchievements(userId);
    res.json(achievementsAdded);
    res.status(200)
})

router.post('/objects', async (req, res) => {
  const { achievementNames } = req.body;
  const achievements = await getAchievementFromName(achievementNames);
  res.json(achievements);
  res.status(200)
})
  

export default router;