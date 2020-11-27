import { Router } from 'express';
import { getYoutubeVideosRelated } from '../controllers/content-controller';

const router = Router();


router.get('/youtube', async (req, res) => {
    const { label } = req.query
    const response = await getYoutubeVideosRelated(label);
    res.json({response })
})

export default router;
