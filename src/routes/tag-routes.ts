import { addContentTag, addManyContentTags, deleteTag, getContentTags } from '../controllers/tag-controller';
import { Router } from 'express';

const router = Router();

// returns a full list of tags
router.get('/', async (req, res) => {
    const response = await getContentTags();
    if (response.length > 0) {
        const tags = response.map((tagObj: any) => {
            return tagObj.tag;
        })
        res.json({ tags })
    } else {
        res.json({ tags: response })
    }
})

// Adds a new tag
router.post('/', async (req, res) => {
    const { tag } = req.body;
    const response = await addContentTag(tag);
    res.json({ response })

})

// Adds many tags
router.post('/many', async (req, res) => {
    const { tagArray } = req.body;
    const response = await addManyContentTags(tagArray);
    res.json({ response })
})

// Deltes a given tag from the database
router.delete('/', async (req, res) => {
    const { tag } = req.body;
    const response = await deleteTag(tag);
    res.json({ response })
})

export default router;
