import { addContentTag, addManyContentTags, deleteTag, getContentTags } from '../controllers/tag-controller';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    const response = await getContentTags();
    if (response.length > 0) {
        const tags = response.map((tagObj: any) => {
            return tagObj.tag;
        })
        res.json({ tags })
    } else {
        res.json({ response })
    }
})

router.post('/', async (req, res) => {
    const { tag } = req.body;
    const response = await addContentTag(tag);
    res.json({ response })

})

router.post('/many', async (req, res) => {
    const { tagArray } = req.body;
    console.log(tagArray)
    const response = await addManyContentTags(tagArray);
    res.json({ response })
})

router.delete('/', async (req, res) => {
    const { tag } = req.body;
    const response = await deleteTag(tag);
    res.json({ response })
})

export default router;
