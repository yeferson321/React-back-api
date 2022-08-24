import { Router } from 'express'

const router = Router();

router.get('/', async (req, res) => {
    res.json("Api React");
});

export default router;